from django.urls import path
from . import views

urlpatterns = [
    path("keyclub/check_password/", views.check_password),
    path("keyclub/authorize/", views.authorize),
    path("keyclub/oauthcallback/", views.oauthcallback),
    path("keyclub/automate_event/", views.automate_event_api),

    path("band/location/", views.location_view.as_view()),
    path("band/location/<int:pk>/", views.location_view.as_view()),
    path("band/instrument/", views.instrument_view.as_view()),
    path("band/instrument/<int:pk>/", views.instrument_view.as_view()),
    path("band/refresh_data/", views.refresh_data),
]