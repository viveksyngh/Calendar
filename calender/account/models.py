from __future__ import unicode_literals

from django.db import models

# Create your models here.


class Account(models.Model):
    account_id = models.CharField(max_length=255)
    first_name = models.CharField(max_length=100)
    middle_name = models.CharField(max_length=100, null=True, blank=True)
    last_name = models.CharField(max_length=100)
    email_id = models.CharField(max_length=100)
    mobile_number = models.CharField(max_length=10)
    password = models.CharField(max_length=100)

    def __unicode__(self):
        return self.first_name + self.last_name

    @property
    def full_name(self):
        return self.first_name + ' ' + self.last_name
