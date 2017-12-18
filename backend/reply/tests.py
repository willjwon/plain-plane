from django.test import TestCase, Client
from .models import Reply
from plane.models import Plane
from user.models import User
import django.contrib.auth.models as user_model
from level.models import Level
import json


class ReplyTest(TestCase):
    def setUp(self):
        level = Level(flavor="Plain", plane_life_span=3, max_today_write=3, max_today_reply=3, next_level_likes=10)
        level.save()

        user = user_model.User.objects.create_user(username='testusername', password='testpassword')
        user.save()

        reply_user = user_model.User.objects.create_user(username='replyusername', password='replypassword')
        reply_user.save()

        self.user = User(user=user, today_write_count=10, today_reply_count=10, total_likes=10, level=level)
        self.user.save()

        self.reply_user = User(user=reply_user, today_write_count=10, today_reply_count=10, total_likes=10, level=level)
        self.reply_user.save()

        self.plane = Plane(author=self.user, content='content', tag='tag')
        self.plane.save()

        self.reply = Reply(plane_author=self.user,
                           reply_author=self.reply_user,
                           original_content='orig',
                           original_tag='orig_tag',
                           content='cont')
        self.reply.save()

        self.client = Client()

    def test_write_plane(self):
        self.client.login(username='testusername', password='testpassword')
        data = {'plane_author': self.user.id,
                'original_content': self.plane.content,
                'original_tag': self.plane.tag,
                'content': 'reply-content'}
        response = self.client.post('/api/reply/new/', json.dumps(data), content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_get_reply_not_exist(self):
        self.client.login(username='testusername', password='testpassword')
        response = self.client.get('/api/reply/123/')
        self.assertEqual(response.status_code, 404)

    def test_get_reply_wrong_user(self):
        reply_id = self.reply.id
        self.client.login(username='replyusername', password='replypassword')
        response = self.client.get('/api/reply/{}/'.format(reply_id))
        self.assertEqual(response.status_code, 403)

    def test_get_reply(self):
        reply_id = self.reply.id
        self.client.login(username='testusername', password='testpassword')
        response = self.client.get('/api/reply/{}/'.format(reply_id))
        self.assertEqual(response.status_code, 200)


    # def test_decrease_today_write(self):
    #     self.user.decrease_today_write()
    #     self.assertEqual(self.user.today_write_count, 9)
    #
    # def test_decrease_today_reply(self):
    #     self.user.decrease_today_reply()
    #     self.assertEqual(self.user.today_reply_count, 9)
    #
    # def test_increase_likes(self):
    #     self.user.increase_likes()
    #     self.assertEqual(self.user.total_likes, 11)
    #
    # def test_decrease_likes(self):
    #     self.user.decrease_likes()
    #     self.assertEqual(self.user.total_likes, 9)
    #
    # # test views.py
    # def test_sign_up_wrong_method(self):
    #     response = self.client.get('/api/user/sign_up/')
    #     self.assertEqual(response.status_code, 405)
