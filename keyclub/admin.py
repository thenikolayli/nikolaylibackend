from django.contrib import admin
from .models import Event_Logged

# Register your models here.
@admin.register(Event_Logged)
class Event_Logged_Admin(admin.ModelAdmin):
    list_display = ("timestamp", "event_title", "hours_logged", "hours_not_logged", "people_attended")