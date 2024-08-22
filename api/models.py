from django.db import models

# Create your models here.
class Event_Automated(models.Model):
    timestamp = models.DateTimeField(auto_now_add=True)
    event_title = models.CharField(default="no name", max_length=255)
    hours_updated = models.FloatField(default=0.00)
    hours_not_updated = models.FloatField(default=0.00)
    people_attended = models.IntegerField(default=0)

    def __str__(self):
        return self.event_title