from django.db import models
from user.models import User


class Reply(models.Model):
    plane_author = models.ForeignKey(User, related_name='replies')
    reply_author = models.ForeignKey(User, related_name='+')

    original_content = models.TextField()
    original_tag = models.CharField(max_length=10)

    content = models.TextField()

    is_reported = models.BooleanField(default=False)
