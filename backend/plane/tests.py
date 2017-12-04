from django.test import TestCase, Client
from user.models import User
import django.contrib.auth.models as user_model
from .models import Plane
import json


class PlaneTestCase(TestCase):
    def setUp(self):
        user1 = user_model.User.objects.create_user(username='baryberri', password='1234')
        user2 = user_model.User.objects.create_user(username='pptnz', password='1234')
        user3 = user_model.User.objects.create_user(username='LeeHyunJong', password='1234')

        author1 = User(user=user1, today_write_count=3, today_reply_count=3, total_likes=2)
        author1.save()

        author2 = User(user=user2, today_write_count=3, today_reply_count=3, total_likes=2)
        author2.save()

        author3 = User(user=user3, today_write_count=3, today_reply_count=3, total_likes=2)
        author3.save()

        plane1 = Plane(author=author1, content='I am so sad', is_replied=False, is_reported=False,
                       latitude=37.0, longitude=128.0, tag='#exam', has_location=True)
        plane1.set_expiration_date()
        plane1.save()

        plane2 = Plane(author=author1, content='I am tired', is_replied=False, is_reported=False,
                       latitude=37.0, longitude=128.0, tag='#love', has_location=True)
        plane2.set_expiration_date()
        plane2.save()

        plane3 = Plane(author=author2, content='I broke up yesterday', is_replied=False,
                       is_reported=False, tag='#study', has_location=False)
        plane3.set_expiration_date()
        plane3.save()

        plane4 = Plane(author=author2, content='I miss my friend', is_replied=False, is_reported=False,
                       tag='#diet', has_location=False)
        plane4.set_expiration_date()
        plane4.save()

        plane5 = Plane(author=author3, content='Diet', is_replied=False, is_reported=False,
                       latitude=37.0, longitude=128.0, tag='#exam', has_location=True)
        plane5.set_expiration_date()
        plane5.save()

        plane1.set_is_replied(True)
        plane1.set_is_reported(True)

        self.client = Client()

    def test_write_plane(self):
        self.client.login(username='baryberri', password='1234')
        response = self.client.post('/api/plane/new/', json.dumps({'content': 'I hate him', 'tag': '#love',
                                                                   'latitude': 37.0, 'longitude': 128.0,
                                                                   'has_location': True}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = self.client.get('/api/plane/6/')
        data = json.loads(response.content.decode())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['author_id'], 1)
        self.assertEqual(data['content'], 'I hate him')
        self.assertEqual(data['tag'], '#love')

        response = self.client.get('/api/plane/random/')
        self.assertEqual(response.status_code, 200)

    def test_write_plane_not_authenticated(self):
        response = self.client.post('/api/plane/new/', json.dumps({'content': 'I hate him', 'tag': '#love',
                                                                   'latitude': 37.0, 'longitude': 128.0,
                                                                   'has_location': True}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_plane_detail(self):
        self.client.login(username='baryberri', password='1234')
        response = self.client.get('/api/plane/1/')
        data = json.loads(response.content.decode())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['author_id'], 1)
        self.assertEqual(data['content'], 'I am so sad')
        self.assertEqual(data['tag'], '#exam')

        response = self.client.get('/api/plane/10/')
        self.assertEqual(response.status_code, 404)

        response = self.client.post('/api/plane/1/',
                                    json.dumps({'author_id': 5, 'content': 'I hate him', 'tag': '#love',
                                                'latitude': 37.0, 'longitude': 128.0, 'has_location': True}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_get_random_planes(self):
        self.client.login(username='baryberri', password='1234')
        response = self.client.get('/api/plane/random/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 3)  # if the number of planes is less than 6

        author3 = User.objects.get(id=3)
        Plane.objects.create(author=author3, content='Diet2', is_replied=False, is_reported=False,
                             latitude=37.0, longitude=128.0, tag="#hello")
        Plane.objects.create(author=author3, content='Diet3', is_replied=False, is_reported=False,
                             latitude=37.0, longitude=128.0, tag="#bye")
        response = self.client.get('/api/plane/random/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 5)  # if the number of planes is more than 6

        response = self.client.post('/api/plane/random/',
                                    json.dumps({'author_id': 5, 'content': 'I hate him', 'tag': '#love',
                                                'latitude': 37.0, 'longitude': 128.0, 'has_location': True}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 405)
