from django.contrib import admin
from .models import Location, Instrument

# Register your models here.
@admin.register(Location)
class Location_Admin(admin.ModelAdmin):
    list_display = ["name", "pk"]

@admin.register(Instrument)
class Instrument_Admin(admin.ModelAdmin):
    list_display = ("name", "subtype", "type", "location", "pk")