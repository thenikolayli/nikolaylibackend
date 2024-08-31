from django.db import models

# Create your models here.
class Location(models.Model):
    name = models.CharField(default="blank location", max_length=255)

class Instrument(models.Model):
    name = models.CharField(default="blank instrument", max_length=255) # ie 5 octave marimba
    subtype = models.CharField(default="blank subtype", max_length=255) # ie marimba
    type = models.CharField(default="blank type", max_length=255) # ie keyboard
    location = models.ForeignKey(Location, on_delete=models.CASCADE) # ie jhs