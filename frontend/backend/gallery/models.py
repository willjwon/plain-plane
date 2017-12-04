import uuid

from django.db import models

# Create your models here.
from user.models import User


class Photo(models.Model):
    # uploaded image
    def unique_filename(instance, filename):
        extension = filename.split(".")[-1]
        return "{}.{}".format(uuid.uuid4(), extension)

    image = models.ImageField('Image', upload_to=unique_filename)

    author = models.ForeignKey(User)
    is_reported = models.BooleanField()

    # RED = 0, ORANGE = 1, YELLOW = 2, GREEN = 3, BLUE = 4, VIOLET = 5
    color = models.IntegerField()

    tag = models.CharField(max_length=10)

    # delete the photo
    def delete(self, *args, **kwargs):
        # delete the image file
        self.image.delete()

        # delete the Photo instance
        super(Photo, self).delete(*args, **kwargs)

