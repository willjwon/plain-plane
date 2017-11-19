from django.db import models
from django_enumfield import enum
import django.contrib.auth.models as user_model


class User(models.Model):
    user = models.OneToOneField(user_model.User, on_delete=models.CASCADE)

    # TODO: Add level field

    today_write_count = models.IntegerField()
    today_reply_count = models.IntegerField()
    total_likes = models.IntegerField()

    # TODO: Implement methods after adding Level field - Check 'level' attribute name is right.
    # def initialize_today_write(self):
    #     self.today_write_count = level.max_today_write
    #
    # def initialize_today_reply(self):
    #     self.today_reply_count = level.max_today_reply

    # TODO: Check condition when write_count, reply_count is negative. =====
    def decrease_today_write(self):
        self.today_write_count -= 1

    def decrease_today_reply(self):
        self.today_reply_count -= 1
    # TODO: Check above here ===============================================

    def increase_likes(self):
        self.total_likes += 1

    # TODO: Check when like is negative.
    def decrease_likes(self):
        self.total_likes -= 1

    # TODO: Implement methods after adding Level field
    # def set_level(self):
    #     # level-up logic


class Tag(models.Model):
    content = models.CharField(max_length=5)

    planes = models.ForeignKey('Plane')
    replies = models.ForeignKey('Reply')
    photos = models.ForeignKey(Photo, related_name='photos')


class Color(enum.Enum):
    RED = 0
    ORANGE = 1
    YELLOW = 2
    GREEN = 3
    BLUE = 4
    INDIGO = 5
    VIOLET = 6
    BLACK = 7


class Photo(models.Model):
    image = models.ImageField(upload_to='uploads/%Y/%m/%d')

    author = models.ForeignKey(User)
    is_reported = models.BooleanField()
    color = enum.EnumField(Color)

    # random order
    def get_randomly(self):
        return Photo.objects.all().order_by('?')[:9]

    # get random 9 photos of a specific color
    def get_by_color(self, color):
        return Photo.objects.all().filter(lambda photo: photo.color == color).order_by('?')[:9]

    # get report by user and change the flag
    def report_bad_content(self):
        self.is_reported = True

    # delete the photo
    def delete(self, *args, **kwargs):
        # delete the image file
        self.image.delete()

        # delete the Photo instance
        super(Photo, self).delete(*args, **kwargs)

