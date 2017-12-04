from django.db import models
from user.models import User
import json


class Plane(models.Model):
    author = models.ForeignKey(
        User,
        related_name='planes',
        null=False,
        on_delete=models.DO_NOTHING
    )

    content = models.TextField()
    
    expiration_date = models.IntegerField(default=0)

    is_replied = models.BooleanField(default=False)
    is_reported = models.BooleanField(default=False)

    tag = models.CharField(max_length=10)

    # location coordinates
    has_location = models.BooleanField(default=False)
    latitude = models.FloatField(null=True)
    longitude = models.FloatField(null=True)

    seen_by = models.TextField(default=json.dumps([]))

    def add_user_seen(self, user_id):
        new_json = json.loads(self.seen_by)
        new_json.append(user_id)
        self.seen_by = json.dumps(new_json)

    def has_user_seen(self, user_id):
        users = json.loads(self.seen_by)
        return user_id in users

    # TODO: photo field as foreign key

    # TODO: set expiration_date by level
    def set_expiration_date(self):
        self.expiration_date = 10

    def set_is_replied(self, is_replied):
        self.is_replied = is_replied
    
    def set_is_reported(self, is_reported):
        self.is_reported = is_reported
    
    # TODO: delete replied plane
