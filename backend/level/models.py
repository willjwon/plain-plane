from django.db import models


class Level(models.Model):
    flavor = models.CharField(max_length=32)

    # save lifespan as timestamp, not in date form
    plane_life_span = models.IntegerField()

    max_today_write = models.IntegerField()
    max_today_reply = models.IntegerField()

    next_level_likes = models.IntegerField()

    # TODO: This field is deprecated as it works as same as next_level_likes field.
    # required_likes = models.IntegerField()
