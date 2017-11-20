from django.db import models
from user.models import User
from tag.models import Tag

class Plane(models.Model):

    author = models.ForeignKey(
        User,
        related_name = 'planes',
        null = False
    )

    content = models.TextField()
    
    expiration_date = models.IntegerField(default=0)

    is_replied = models.BooleanField()
    is_reported = models.BooleanField()

    tag_list = models.ManyToManyField(
        Tag,
        related_name = 'plane_list'
    )

    # location coordinates
    latitude = models.FloatField(default = -1)
    longitude = models.FloatField(default = -1)

    # TODO: photo field as foreign key

    # Serialize tag_list e.g. #tag1#tag2
    def get_tag_list(self):
        tag_string = ''
        for tag in self.tag_list.all():
            tag_string = tag_string + '#' + tag.tag
        return tag_string

    # TODO: set expiration_date by level
    def set_expiration_date(self):
        self.expiration_date = 10

    def set_is_replied(self, is_replied):
        self.is_replied = is_replied
    
    def set_is_reported(self, is_reported):
        self.is_reported = is_reported
    
    # TODO: delete replied plane