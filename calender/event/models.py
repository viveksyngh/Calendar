from __future__ import unicode_literals

from django.db import models
from account.models import Account

# Create your models here.


class Event(models.Model):
    event_id = models.AutoField(primary_key=True)
    event_name = models.CharField(max_length=255)
    location = models.CharField(max_length=255)
    start_datetime = models.DateTimeField()
    end_datetime = models.DateTimeField()
    description = models.TextField(default='', blank=True)
    is_deleted = models.BooleanField(default=False)
    account = models.ForeignKey(Account)

    def __unicode__(self):
        return str(self.event_id)

    def serialize(self):
        event = { }
        event["id"] = self.event_id
        event["event_name"] = self.event_name
        event["event_location"] = self.location
        event["start_datetime"] = str(self.start_datetime)
        event["end_datetime"] = str(self.end_datetime)
        event["description"] = self.description
        return event
    


    
