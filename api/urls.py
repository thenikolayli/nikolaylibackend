from django.urls import path
from .views import *

urlpatterns = [
    path("check_password/", check_password),
    path("authorize/", authorize),
    path("oauthcallback/", oauthcallback),
    path("automate_event/", automate_event_api)
]