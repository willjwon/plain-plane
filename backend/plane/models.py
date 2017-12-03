from django.db import models
from user.models import User


class Plane(models.Model):
    author = models.ForeignKey(
        User,
        related_name='planes',
        null=False
    )

    content = models.TextField()
    
    expiration_date = models.IntegerField(default=0)

    is_replied = models.BooleanField()
    is_reported = models.BooleanField()

    tag = models.CharField(max_length=10, null=True)

    # location coordinates
    latitude = models.FloatField(default=-1)
    longitude = models.FloatField(default=-1)

    # TODO: photo field as foreign key

    # TODO: set expiration_date by level
    def set_expiration_date(self):
        self.expiration_date = 10

    def set_is_replied(self, is_replied):
        self.is_replied = is_replied
    
    def set_is_reported(self, is_reported):
        self.is_reported = is_reported
    
    # TODO: delete replied plane
