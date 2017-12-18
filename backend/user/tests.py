from django.test import TestCase, Client
import django.contrib.auth.models as user_model
from .models import User
from level.models import Level
from .viewsets import UserViewSet
from .tokens import PasswordResetTokenGenerator
import json


class UserTest(TestCase):
    def setUp(self):
        user = user_model.User(username="testusername", password="testpassword")
        user.save()

        level = Level(flavor='Plain', max_today_reply=1, max_today_write=2, next_level_likes=3, plane_life_span=4)
        level.save()

        next_level = Level(flavor='Strawberry', max_today_reply=1, max_today_write=2, next_level_likes=20, plane_life_span=4)
        next_level.save()

        soy_sauce_level = Level(flavor='SoySauce', max_today_reply=1, max_today_write=2, next_level_likes=3, plane_life_span=4)
        soy_sauce_level.save()

        self.user = User(user=user, today_write_count=10, today_reply_count=10, total_likes=10, level=level)
        self.user.save()
        self.client = Client()

    # test models.py
    def test_decrease_today_write(self):
        self.user.decrease_today_write()
        self.assertEqual(self.user.today_write_count, 9)

    def test_decrease_today_reply(self):
        self.user.decrease_today_reply()
        self.assertEqual(self.user.today_reply_count, 9)

    def test_increase_likes(self):
        self.user.increase_likes()
        self.assertEqual(self.user.total_likes, 11)

    def test_decrease_likes(self):
        self.user.decrease_likes()
        self.assertEqual(self.user.total_likes, 9)

    # test views.py
    def test_sign_up_wrong_method(self):
        response = self.client.get('/api/user/sign_up/')
        self.assertEqual(response.status_code, 405)

    def test_sign_up_captcha_not_done(self):
        data = {'username': 'testusername', 'password': 'testuserpassword', 'g-recaptcha-response': 'test'}
        response = self.client.post('/api/user/sign_up/', json.dumps(data), content_type='application/json')
        response_data = json.loads(response.content.decode())
        self.assertEqual(response_data, {'success': False, 'error-code': 2})

    def test_sign_up_key_error(self):
        data = {'username': 'testusername'}
        response = self.client.post('/api/user/sign_up/', json.dumps(data), content_type='application/json')
        response_data = json.loads(response.content.decode())
        self.assertEqual(response_data, {'success': False, 'error-code': 1})

    def test_sign_in_key_error(self):
        data = {'username': 'testusername'}
        response = self.client.post('/api/user/sign_in/', json.dumps(data), content_type='application/json')
        response_data = json.loads(response.content.decode())
        self.assertEqual(response_data, {'success': False, 'error-code': 1})

    def test_sign_in_wrong_method(self):
        response = self.client.get('/api/user/sign_in/')
        self.assertEqual(response.status_code, 405)

    def test_sign_in_captcha_not_done(self):
        data = {'username': 'testusername', 'password': 'testuserpassword', 'g-recaptcha-response': 'test'}
        response = self.client.post('/api/user/sign_in/', json.dumps(data), content_type='application/json')
        response_data = json.loads(response.content.decode())
        self.assertEqual(response_data, {'success': False, 'error-code': 2})

    def test_check_user_available(self):
        data = {'username': 'hello'}
        response = self.client.post('/api/user/check/', json.dumps(data), content_type='application/json')
        response_data = json.loads(response.content.decode())
        self.assertEqual(response_data, {'available': True})

    def test_check_user_not_available(self):
        data = {'username': 'testusername'}
        response = self.client.post('/api/user/check/', json.dumps(data), content_type='application/json')
        response_data = json.loads(response.content.decode())
        self.assertEqual(response_data, {'available': False})

    def test_random_password(self):
        password = UserViewSet.random_password(8)
        self.assertEqual(len(password), 8)

    def test_find_password_key_error(self):
        data = {'username': 'testusername', 'email': 'abc@def'}
        response = self.client.post('/api/user/find_password/', json.dumps(data), content_type='application/json')
        response_data = json.loads(response.content.decode())
        self.assertEqual(response_data, {'success': False, 'error-code': 1})

    def test_get_signed_in_user_not_signed_in(self):
        response = self.client.get('/api/user/get/')
        self.assertEqual(response.status_code, 403)

    def test_sign_out(self):
        response = self.client.get('/api/user/sign_out/')
        self.assertEqual(response.status_code, 200)

    def test_token_generator(self):
        result = PasswordResetTokenGenerator()._make_hash_value(self.user.user, 0)
        self.assertIsNotNone(result)

    def test_initialize_today_write(self):
        self.user.initialize_today_write()
        self.user.save()
        self.assertEqual(self.user.today_write_count, 2)

    def test_initialize_today_reply(self):
        self.user.initialize_today_reply()
        self.user.save()
        self.assertEqual(self.user.today_reply_count, 1)

    def test_set_level_soy_sauce(self):
        self.user.total_likes = -20
        self.user.set_level()
        self.assertEqual(self.user.level.flavor, "SoySauce")

    def test_set_level_up(self):
        self.user.total_likes = 10
        self.user.set_level()
        self.assertEqual(self.user.level.flavor, "Strawberry")


