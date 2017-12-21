from django.test import TestCase, Client
from user.models import User
import django.contrib.auth.models as user_model
from .models import Plane
from level.models import Level
import json


class PlaneTestCase(TestCase):
    def setUp(self):
        self.user1 = user_model.User.objects.create_user(username='user1', password='1234')
        self.user2 = user_model.User.objects.create_user(username='user2', password='1234')
        self.user3 = user_model.User.objects.create_user(username='user3', password='1234')

        level = Level(flavor="Plain", plane_life_span=1, max_today_write=3, max_today_reply=3, next_level_likes=10)
        level.save()

        self.author1 = User(user=self.user1, today_write_count=3, today_reply_count=3, total_likes=2, level=level)
        self.author1.save()

        self.author2 = User(user=self.user2, today_write_count=3, today_reply_count=3, total_likes=2, level=level)
        self.author2.save()

        self.author3 = User(user=self.user3, today_write_count=3, today_reply_count=3, total_likes=2, level=level)
        self.author3.save()

        self.plane1 = Plane(author=self.author1, content='I am so sad', is_replied=False, is_reported=False,
                            latitude=37.0, longitude=128.0, tag='#exam', has_location=True)
        self.plane1.set_expiration_date()
        self.plane1.save()

        self.plane2 = Plane(author=self.author1, content='I am tired', is_replied=False, is_reported=False,
                            latitude=37.010706, longitude=127.879217, tag='#love', has_location=True)
        self.plane2.set_expiration_date()
        self.plane2.save()

        self.plane3 = Plane(author=self.author2, content='I broke up yesterday', is_replied=False,
                            is_reported=False, tag='#study', has_location=False)
        self.plane3.set_expiration_date()
        self.plane3.save()

        plane4 = Plane(author=self.author2, content='I miss my friend', is_replied=False, is_reported=False,
                       latitude=37.0, longitude=128.0, tag='#diet', has_location=True)
        plane4.set_expiration_date()
        plane4.save()

        plane5 = Plane(author=self.author3, content='Diet', is_replied=False, is_reported=False,
                       latitude=37.010706, longitude=127.879217, tag='#exam', has_location=True)
        plane5.set_expiration_date()
        plane5.save()

        self.plane1.set_is_replied(True)
        self.plane1.set_is_reported(True)

        self.client = Client()

    def test_write_plane(self):
        self.client.login(username='user1', password='1234')
        response = self.client.post('/api/plane/new/', json.dumps({'content': 'I hate him', 'tag': '#love',
                                                                   'latitude': 37.0, 'longitude': 128.0,
                                                                   'has_location': True}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

        response = self.client.get('/api/plane/random/')
        self.assertEqual(response.status_code, 200)

    def test_write_plane_without_location(self):
        self.client.login(username='user1', password='1234')
        response = self.client.post('/api/plane/new/', json.dumps({'content': 'I hate him', 'tag': '#love', 'has_location': False}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 201)

    def test_write_plane_not_authenticated(self):
        response = self.client.post('/api/plane/new/', json.dumps({'content': 'I hate him', 'tag': '#love',
                                                                   'latitude': 37.0, 'longitude': 128.0,
                                                                   'has_location': True}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_plane_detail(self):
        self.client.login(username='user1', password='1234')
        response = self.client.get('/api/plane/{}/'.format(self.plane1.id))
        data = json.loads(response.content.decode())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['author_id'], self.author1.id)
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
        self.client.login(username='user1', password='1234')
        response = self.client.get('/api/plane/random/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 3)  # if the number of planes is less than 6

        Plane.objects.create(author=self.author3, content='Diet2', is_replied=False, is_reported=False,
                             latitude=37.0, longitude=128.0, tag="#hello")
        Plane.objects.create(author=self.author3, content='Diet3', is_replied=False, is_reported=False,
                             latitude=37.0, longitude=128.0, tag="#bye")
        response = self.client.get('/api/plane/random/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 5)  # if the number of planes is more than 6

        response = self.client.post('/api/plane/random/',
                                    json.dumps({'author_id': 5, 'content': 'I hate him', 'tag': '#love',
                                                'latitude': 37.0, 'longitude': 128.0, 'has_location': True}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_get_near_planes(self):
        self.client.login(username='user1', password='1234')
        response = self.client.post('/api/plane/location/5/',
                                    json.dumps({'latitude': 36.979061, 'longitude': 127.993911}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)

        response = self.client.get('/api/plane/location/5/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 1)  # if the number of planes is less than 6

        Plane.objects.create(author=self.author3, content='Diet2', is_replied=False, is_reported=False,
                             latitude=36.979332, longitude=127.970564, tag="#hello", has_location=True)
        Plane.objects.create(author=self.author3, content='Diet3', is_replied=False, is_reported=False,
                             latitude=36.979332, longitude=127.970564, tag="#bye", has_location=True)

        # post location and then get planes
        response = self.client.post('/api/plane/location/5/',
                                    json.dumps({'latitude': 36.979061, 'longitude': 127.993911}),
                                    content_type='application/json')
        self.assertEqual(response.status_code, 200)
        response = self.client.get('/api/plane/location/5/')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 3)  # if the number of planes is more than 6

        response = self.client.put('/api/plane/location/5/',
                                   json.dumps({'author_id': 5, 'content': 'I hate him', 'tag': '#love',
                                               'latitude': 37.0, 'longitude': 128.0, 'has_location': True}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_user_seen(self):
        self.client.login(username='user1', password='1234')
        self.plane1.add_user_seen(self.user1.user.id)
        self.plane1.save()
        self.assertEqual(self.plane1.has_user_seen(self.user1.user.id), True)

    def test_plane_set_replied_not_exist(self):
        self.client.login(username='user1', password='1234')
        response = self.client.put('/api/plane/123/', json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_plane_set_replied_not_seen(self):
        self.client.login(username='user1', password='1234')
        response = self.client.put('/api/plane/{}/'.format(self.plane1.id), json.dumps({}), content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_plane_set_replied(self):
        self.client.login(username='user1', password='1234')
        self.plane1.add_user_seen(self.user1.user.id)
        self.plane1.save()
        response = self.client.put('/api/plane/{}/'.format(self.plane1.id), json.dumps({}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_report_plane_not_exist(self):
        self.client.login(username='user1', password='1234')
        response = self.client.put('/api/plane/report/1234/', json.dumps({}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_report_plane_not_seen(self):
        self.client.login(username='user1', password='1234')
        response = self.client.put('/api/plane/report/{}/'.format(self.plane1.id), json.dumps({}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_report_plane(self):
        self.client.login(username='user1', password='1234')
        self.plane1.add_user_seen(self.user1.user.id)
        self.plane1.save()
        response = self.client.put('/api/plane/report/{}/'.format(self.plane1.id), json.dumps({}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_delete_plane_not_exist(self):
        self.client.login(username='user1', password='1234')
        response = self.client.put('/api/plane/delete/', json.dumps({'plane_id': 1234}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 404)

    def test_delete_plane_not_seen(self):
        self.client.login(username='user1', password='1234')
        response = self.client.put('/api/plane/delete/', json.dumps({'plane_id': self.plane1.id}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 403)

    def test_delete_plane(self):
        self.client.login(username='user1', password='1234')
        self.plane1.add_user_seen(self.user1.user.id)
        self.plane1.save()
        response = self.client.put('/api/plane/delete/', json.dumps({'plane_id': self.plane1.id}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 200)
