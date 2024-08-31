import hashlib, os, json
from dotenv import load_dotenv

from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow

from django.templatetags.static import static
from django.shortcuts import redirect, resolve_url
from django.views.decorators.csrf import csrf_protect
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, APIView
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

from .keyclub_automation_api import automate_event # , fetch_sheet_data, fetch_docs_data
from keyclub.models import Event_Automated
from band.models import Location, Instrument
from band.serializers import LocationSerializer, InstrumentSerializer


load_dotenv()

client_config = json.loads(os.getenv("CLIENT_CONFIG"))
SCOPES = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/documents"]
redirect_uri = client_config.get("web").get("redirect_uris")[0]
correct_password = """
<h1 class="secondary-dark">
    Correct password!!
</h1>
<h2 class="secondary-dark lh-sm">
    Okay now you have to sign in to use the automation bot. <br>
    Make sure to sign in with the <u>official key club google account</u>, or use any other <br>
    account that has access to and can read/write in the hours spreadsheet.
</h2>
<button id="authorize" class="btn" onclick="authorize()" class='pt-3'>Log in with Google</button>
<script src="/static/js/keyclub/authorize.js"></script>
"""

# Create your views here.
@api_view(["POST"])
@csrf_protect
def check_password(request):
    password = request.data.get("password")
    sha = hashlib.sha256()
    sha.update(password.encode())

    if sha.hexdigest() == "a55e2e3846a51f6ad0abfdfbdea2ba0e5e0c76b5ccfa8a920895fedeae89a8b6":
        authorize_file = request.build_absolute_uri(static("js/keyclub/authorize.js"))
        return Response({"content": correct_password, "id": "content", "file": authorize_file})
    return Response({"content": "Incorrect password", "id": "incorrect-pass-field"})

@api_view(["POST"])
@csrf_protect
def authorize(request):
    flow = InstalledAppFlow.from_client_config(client_config, SCOPES, redirect_uri=redirect_uri)
    redirect_url, state = flow.authorization_url()
    request.session["state"] = state
    
    return Response({"redirect_url": redirect_url})

@api_view(["GET"])
@csrf_protect
def oauthcallback(request):
    state = request.session["state"]
    code = request.GET.get("code")

    flow = InstalledAppFlow.from_client_config(client_config, state=state, scopes=SCOPES, redirect_uri=redirect_uri)
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
@csrf_protect
def automate_event_api(request):
    event_link = request.data.get("event_link")
    hours_multiplier = request.data.get("hours_multiplier")
    creds = request.session.get("creds")
    credentials = Credentials(
        token = creds['token'],
        refresh_token = creds['refresh_token'],
        token_uri = creds['token_uri'],
        client_id = creds['client_id'],
        client_secret = creds['client_secret'],
        scopes = creds['scopes'])
    
    response = automate_event(credentials, event_link, hours_multiplier)

    if not response.get("error"):
        hours_updated, hours_not_updated = 0, 0
        for i in response.get("updated"):
            hours_updated += float(i[1])
        for i in response.get("not_updated"):
            hours_not_updated += float(i[1])
        Event_Automated(event_title=response.get("event_title"), hours_updated=hours_updated, hours_not_updated=hours_not_updated, people_attended=response.get("people_attended")).save()
    
    return Response(response)


@method_decorator(csrf_protect, name="dispatch")
class location_view(APIView):
    def post(self, request):
        serializer = LocationSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return_data = {"data": f"successfully created {request.data.get('name')}"}
        else:
            return_data = {"error": f"could not create {request.data.get('name')}: {' '.join([serializer.errors.get(each)[0].title() for each in serializer.errors])}"}
        
        return Response(return_data)

    def delete(self, request, *args, **kwargs):
        try:
            location = Location.objects.get(pk=kwargs["pk"])
            return_data = {"data": "location deleted successfully"}
        except Location.DoesNotExist:
            return_data = {"error": "location not found"}
            raise NotFound(f'location {kwargs["pk"]} not found')
        
        location.delete()
        return Response(return_data)

@method_decorator(csrf_protect, name="dispatch")
class instrument_view(APIView):
    def post(self, request):
        serializer = InstrumentSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return_data = {"data": f"successfully created {request.data.get('name')}"}
        else:
            return_data = {"error": f"could not create {request.data.get('name')}: {" ".join([serializer.errors.get(each)[0].title() for each in serializer.errors])}"}
        
        return Response(return_data)

    def delete(self, request, *args, **kwargs):
        try:
            instrument = Instrument.objects.get(pk=kwargs["pk"])
            return_data = {"data": "instrument deleted successfully"}
        except Location.DoesNotExist:
            return_data = {"error": "instrument not found"}
            raise NotFound(f'instrument {kwargs["pk"]} not found')
        
        instrument.delete()
        return Response(return_data)

@api_view(["GET"])
def refresh_data(request):
    serialized_instruments = InstrumentSerializer(Instrument.objects.all(), many=True).data
    serialized_locations = LocationSerializer(Location.objects.all(), many=True).data
    
    return Response({"data": {"instruments": serialized_instruments, "locations": serialized_locations}})