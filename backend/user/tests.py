from django.test import TestCase, Client
import django.contrib.auth.models as user_model
from .models import User
from .viewsets import UserViewSet
import json


class UserTest(TestCase):
    def setUp(self):
        user = user_model.User(username="testusername", password="testpassword")
        user.save()

        self.user = User(user=user, today_write_count=10, today_reply_count=10, total_likes=10)
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

