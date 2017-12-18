from django.db import models
import django.contrib.auth.models as user_model
from level.models import Level
from django.utils.timezone import now


class User(models.Model):
    user = models.OneToOneField(user_model.User, on_delete=models.CASCADE, related_name='user')
    email_verified = models.BooleanField(default=False)
    level = models.ForeignKey(Level, on_delete=models.DO_NOTHING, related_name='+')
    today_write_count = models.IntegerField(default=0)
    today_reply_count = models.IntegerField(default=0)
    total_likes = models.IntegerField(default=0)
    last_sign_in_date = models.DateField(default=now)

    def initialize_today_write(self):
        self.today_write_count = self.level.max_today_write

    def initialize_today_reply(self):
        self.today_reply_count = self.level.max_today_reply

    def decrease_today_write(self):
        if self.today_write_count > 0:
            self.today_write_count -= 1

    def decrease_today_reply(self):
        if self.today_reply_count > 0:
            self.today_reply_count -= 1

    def increase_likes(self):
        self.total_likes += 1

    def decrease_likes(self):
        self.total_likes -= 1

    def set_level(self):
        if self.total_likes <= -10:
            self.level = Level.objects.get(id="SoySauce")
            return True

        level_changed = False
        while self.total_likes >= self.level.next_level_likes:
            self.level = Level.get_next_level(self.level)
            level_changed = True

        return level_changed

