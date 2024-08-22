from django.contrib import admin
from .models import Event_Automated

# Register your models here.
@admin.register(Event_Automated)
class Event_Automated_Admin(admin.ModelAdmin):
    list_display = ("timestamp", "event_title", "hours_updated", "hours_not_updated", "people_attended")