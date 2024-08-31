from django.shortcuts import render
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from django.views.decorators.csrf import csrf_protect

# Create your views here.
def homepage(request):
    return render(request, "keyclub/homepage.html")

def automation(request):
    creds = request.session.get("creds")
    if creds:
        credentials = Credentials(
        token = creds['token'],
        refresh_token = creds['refresh_token'],
        token_uri = creds['token_uri'],
        client_id = creds['client_id'],
        client_secret = creds['client_secret'],
        scopes = creds['scopes'])
        if credentials.expired and credentials.refresh_token:
            credentials.refresh(Request())
            request.session['creds'] = {
                'token': credentials.token,
                'refresh_token': credentials.refresh_token,
                'token_uri': credentials.token_uri,
                'client_id': credentials.client_id,
                'client_secret': credentials.client_secret,
                'scopes': credentials.scopes}
        if not credentials.valid:
            return render(request, "keyclub/automation_page_unauthorized.html")
        return render(request, "keyclub/automation_page_authorized.html")
    return render(request, "keyclub/automation_page_unauthorized.html")