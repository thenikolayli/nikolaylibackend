import hashlib, os, json
from dotenv import load_dotenv
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.templatetags.static import static
from django.shortcuts import redirect, resolve_url
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from .keyclub_automation_api import automate_event, fetch_sheet_data, fetch_docs_data

load_dotenv()

client_config = json.loads(os.getenv("CLIENT_CONFIG"))
SCOPES = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/documents"]
correct_password = """
<h1 class="primary-light">
    Correct password!!
</h1>
<h2 class="primary-light line-spacing">
    Okay now you have to sign in to use the automation bot. <br>
    Make sure to sign in with the <u>official key club google account</u>, or use any other <br>
    account that has access to and can read/write in the hours spreadsheet.
</h2>
<button id="authorize" onclick="authorize()">Log in with Google</button>
<script src="/static/js/authorize.js"></script>
"""

# Create your views here.
@api_view(["POST"])
def check_password(request):
    password = request.data.get("password")
    sha = hashlib.sha256()
    sha.update(password.encode())

    if sha.hexdigest() == "a55e2e3846a51f6ad0abfdfbdea2ba0e5e0c76b5ccfa8a920895fedeae89a8b6":
        authorize_file = request.build_absolute_uri(static("js/authorize.js"))
        return Response({"content": correct_password, "id": "content", "file": authorize_file})
    return Response({"content": "Incorrect password", "id": "incorrect-pass-field"})

@api_view(["POST"])
def authorize(request):
    flow = InstalledAppFlow.from_client_config(client_config, SCOPES, redirect_uri="http://localhost:8000/api/oauthcallback/")
    redirect_url, state = flow.authorization_url()
    request.session["state"] = state
    
    return Response({"redirect_url": redirect_url})

@api_view(["GET"])
def oauthcallback(request):
    state = request.session["state"]
    code = request.GET.get("code")

    flow = InstalledAppFlow.from_client_config(client_config, state=state, scopes=SCOPES, redirect_uri="http://localhost:8000/api/oauthcallback/")
    flow.fetch_token(code=code)
    credentials = flow.credentials
    request.session['creds'] = {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes}

    return redirect(resolve_url("keyclub:automation"))

@api_view(["POST"])
def automate_event_api(request):
    event_link = request.data.get("event_link")
    creds = request.session.get("creds")
    credentials = Credentials(
        token = creds['token'],
        refresh_token = creds['refresh_token'],
        token_uri = creds['token_uri'],
        client_id = creds['client_id'],
        client_secret = creds['client_secret'],
        scopes = creds['scopes'])
    
    response = automate_event(credentials, event_link)
    print(response)
    
    return Response(response)