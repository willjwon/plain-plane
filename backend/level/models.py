from django.db import models
import datetime


class Level(models.Model):
    flavor = models.CharField(max_length=32)

    # lifespan in day
    plane_life_span = models.IntegerField()

    max_today_write = models.IntegerField()
    max_today_reply = models.IntegerField()

    next_level_likes = models.IntegerField()

    @staticmethod
    def get_next_level(current_level):
        if current_level.flavor == "Plain":
            return Level.objects.get(flavor="Strawberry")
        elif current_level.flavor == "Strawberry":
            return Level.objects.get(flavor="Mango")
        elif current_level.flavor == "Mango":
            return Level.objects.get(flavor="Melon")
        elif current_level.flavor == "Melon":
            return Level.objects.get(flavor="Blueberry")
        elif current_level.flavor == "Blueberry":
            return Level.objects.get(flavor="Jasmine")
        elif current_level.flavor == "Jasmine":
            return Level.objects.get(flavor="Jasmine")
        else:
            return Level.objects.get(flavor="Plain")

    def lifespan_in_date_form(self):
        return datetime.timedelta(self.plane_life_span)
