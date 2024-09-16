from django.urls import path
from . import views

urlpatterns = [
    path("keyclub/check_password/", views.keyclub_check_password),
    path("keyclub/authorize/", views.authorize),
    path("keyclub/oauthcallback/", views.oauthcallback),
    path("keyclub/automate_event/", views.automate_event_api),
    path("keyclub/log_out/", views.log_out, name="logout"),

    path("percussion/location/", views.location_view.as_view()),
    path("percussion/location/<int:pk>/", views.location_view.as_view()),
    path("percussion/instrument/", views.instrument_view.as_view()),
    path("percussion/instrument/<int:pk>/", views.instrument_view.as_view()),
    path("percussion/refresh_data/", views.refresh_data),
    path("percussion/filter/", views.filter_instrument_view.as_view()),
    path("percussion/filter_equipment/", views.filter_equipment),
    path("percussion/check_password/", views.percussion_check_password)
]