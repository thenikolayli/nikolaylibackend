from django.shortcuts import render
from google.auth.transport.requests import Request
from django.views.decorators.csrf import csrf_protect
from .models import Location, Instrument
from .serializers import LocationSerializer

# Create your views here.

def homepage(request):
    return render(request, "band/homepage.html")

def create_page(request):
    if request.session.get("percussion_authorized"):
        return render(request, "band/create_page.html")
    return render(request, "band/unauthorized.html")