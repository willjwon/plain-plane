from django.db import models
import django.contrib.auth.models as user_model
from level.models import Level


class User(models.Model):
    user = models.OneToOneField(user_model.User, on_delete=models.CASCADE)
    email_verified = models.BooleanField(default=False)
    # level = models.ForeignKey(Level, related_name='users')
    today_write_count = models.IntegerField()
    today_reply_count = models.IntegerField()
    total_likes = models.IntegerField()

    # def initialize_today_write(self):
    #     self.today_write_count = self.level.max_today_write
    #
    # def initialize_today_reply(self):
    #     self.today_reply_count = self.level.max_today_reply

    def decrease_today_write(self):
        self.today_write_count -= 1

    def decrease_today_reply(self):
        self.today_reply_count -= 1

    def increase_likes(self):
        self.total_likes += 1

    def decrease_likes(self):
        self.total_likes -= 1

    # TODO: Implement methods after adding Level field
    # def set_level(self):
    #     # level-up logic

