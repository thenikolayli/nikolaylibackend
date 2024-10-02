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

from .keyclub_automation_api import log_event # , fetch_sheet_data, fetch_docs_data
from keyclub.models import Event_Logged
from django.contrib.auth import logout
from django.shortcuts import redirect
from band.models import Location, Instrument
from band.serializers import LocationSerializer, InstrumentSerializer


load_dotenv()

client_config = json.loads(os.getenv("CLIENT_CONFIG"))
SCOPES = ["https://www.googleapis.com/auth/spreadsheets", "https://www.googleapis.com/auth/documents"]
redirect_uri = client_config.get("web").get("redirect_uris")[0]
correct_password = """
<h1 class="text-4xl text-l1">
    Correct password!!
</h1>
<h2 class="text-2xl text-l1">
    Okay now you have to sign in to use the automation bot. <br>
    Make sure to sign in with the <u>official key club google account</u>, or use any other <br>
    account that has access to and can read/write in the hours spreadsheet.
</h2>
<button id="authorize" class="dark-button mt-2" onclick="authorize()" class='pt-3'>Log in with Google</button>
<script src="/static/js/keyclub/authorize.js"></script>
"""

def get_hex(password):
    sha = hashlib.sha256()
    sha.update(password.encode())
    return sha.hexdigest()

# Create your views here.
@api_view(["POST"])
@csrf_protect
def keyclub_check_password(request):
    password = request.data.get("password")
    password = get_hex(password)

    if password == "a55e2e3846a51f6ad0abfdfbdea2ba0e5e0c76b5ccfa8a920895fedeae89a8b6":
        authorize_file = request.build_absolute_uri(static("js/keyclub/authorize.js"))
        return Response({"content": correct_password, "id": "content", "file": authorize_file})
    return Response({"content": "Incorrect password", "id": "incorrect_pass_field"})

@api_view(["POST"])
@csrf_protect
def authorize(request):
    flow = InstalledAppFlow.from_client_config(client_config, SCOPES, redirect_uri=redirect_uri)
    redirect_url, state = flow.authorization_url(prompt="consent")
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
def log_event_api(request):
    event_link = request.data.get("event_link") # link to event/meeting to log
    hours_multiplier = request.data.get("hours_multiplier", 1) # hours multiplier
    creds = request.session.get("creds") # build credentials
    credentials = Credentials(
        token = creds['token'],
        refresh_token = creds['refresh_token'],
        token_uri = creds['token_uri'],
        client_id = creds['client_id'],
        client_secret = creds['client_secret'],
        scopes = creds['scopes'])
    first_name_col = request.data.get("first_name_col") # meeting variables
    last_name_col = request.data.get("last_name_col")
    meeting_length = request.data.get("meeting_length")
    meeting_title = request.data.get("meeting_title")
    
    response = log_event(id=event_link, hours_multiplier=hours_multiplier, credentials=credentials, first_name_col=first_name_col, last_name_col=last_name_col, meeting_length=meeting_length, meeting_title=meeting_title)

    if not response.get("error"):
        logged = response.get("logged")
        not_logged = response.get("not_logged")
        hours_logged = 0
        hours_not_logged = 0
        people_attended = 0

        for name in logged:
            hours_logged += float(logged.get(name).get("hours"))
            people_attended =+ 1
        for name in not_logged:
            hours_logged += float(not_logged.get(name).get("hours"))
            people_attended =+ 1

        Event_Logged(event_title=response.get("event_title"), hours_logged=hours_logged, hours_not_logged=hours_not_logged, people_attended=people_attended).save()
    
    return Response(response)

@csrf_protect
def log_out(request):
    logout(request)

    return redirect("keyclub:homepage")


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
            return_data = {"error": f"could not create {request.data.get('name')}: {' '.join([serializer.errors.get(each)[0].title() for each in serializer.errors])}"}
        
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

@method_decorator(csrf_protect, name="dispatch")
class filter_instrument_view(APIView):
    def get(self, request):
        filter_instruments = request.session.get("filtered_instruments", [])

        return Response({"data": filter_instruments})
    
    def post(self, request):
        filter_instruments = request.session.get("filtered_instruments", [])
        instrument = request.data.get("name")

        if instrument != "":
            filter_instruments.append(instrument)
            request.session.update({"filtered_instruments": filter_instruments})
            request.session.modified = True

        return Response({"data": filter_instruments})
    
    def delete(self, request):
        filter_instruments = request.session.get("filtered_instruments")
        instrument = request.data.get("name")

        if instrument != "clear_all_instruments":
            filter_instruments.pop(filter_instruments.index(instrument))
        else:
            filter_instruments = []
        request.session.update({"filtered_instruments": filter_instruments})
        request.session.modified = True

        return Response({"data": filter_instruments})

@api_view(["POST"])
@csrf_protect
def filter_equipment(request):
    instrument_list = request.session["filtered_instruments"]
    to_bring = instrument_list.copy()
    alr_there = []

    # jhs_id = Location.objects.get(name="jhs").pk
    location_id = request.data.get("location_pk")
    # jhs_instruments = Instrument.objects.filter(location=jhs_id)
    # jhs_instruments = InstrumentSerializer(jhs_instruments, many=True).data
    # jhs_instruments = [instrument.get("subtype") for instrument in jhs_instruments]
    location_instruments = Instrument.objects.filter(location=location_id)
    location_instruments = InstrumentSerializer(location_instruments, many=True).data
    location_instruments = [instrument.get("subtype") for instrument in location_instruments]

    for instrument in instrument_list:
        if instrument in location_instruments:
            to_bring.pop(to_bring.index(instrument))
            alr_there.append(instrument)
            location_instruments[location_instruments.index(instrument)] = ""

    return Response({"data": {"to_bring": to_bring, "alr_there": alr_there}})

@api_view(["POST"])
@csrf_protect
def percussion_check_password(request):
    password = request.data.get("password")
    password = get_hex(password)

    if password == "ae05a3bf72601ef696e4fdcffca744e03ee7a48069839f3616acf8368d4f9cf7":
        request.session.update({"percussion_authorized": True})
        return Response({"data": resolve_url("percussion:create_page")})
    return Response({"error": "Incorrect password"})