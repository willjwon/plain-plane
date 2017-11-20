from django.db import models
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

