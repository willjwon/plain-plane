from django.test import TestCase, Client
from user.models import User
import django.contrib.auth.models as user_model
from .models import Plane
from tag.models import Tag
import json

class PlaneTestCase(TestCase):
    def setUp(self):
        user1 = user_model.User.objects.create(username='baryberri', password='1234')
        user2 = user_model.User.objects.create(username='pptnz', password='1234')
        user3 = user_model.User.objects.create(username='LeeHyunJong', password='1234')
        author1 = User.objects.create(user=user1, today_write_count=3, today_reply_count=3, total_likes=2)
        author2 = User.objects.create(user=user2, today_write_count=3, today_reply_count=3, total_likes=2)
        author3 = User.objects.create(user=user3, today_write_count=3, today_reply_count=3, total_likes=2)
        tag1 = Tag.objects.create(tag='exam')
        tag2 = Tag.objects.create(tag='love')
        tag3 = Tag.objects.create(tag='study')
        tag4 = Tag.objects.create(tag='diet')
        plane1 = Plane.objects.create(author=author1, content='I am so sad', is_replied = False, is_reported = False,
            latitude = 37.0, longitude = 128.0)
        plane1.set_expiration_date()
        plane1.tag_list.add(tag1)
        plane2 = Plane.objects.create(author=author1, content='I am tired', is_replied = False, is_reported = False,
            latitude = 37.0, longitude = 128.0)
        plane2.set_expiration_date()
        plane2.tag_list.add(tag1)
        plane2.tag_list.add(tag3)
        plane3 = Plane.objects.create(author=author2, content='I broke up yesterday', is_replied = False, is_reported = False)
        plane3.set_expiration_date()
        plane3.tag_list.add(tag2)
        plane4 = Plane.objects.create(author=author2, content='I miss my friend', is_replied = False, is_reported = False)
        plane4.set_expiration_date()
        plane4.tag_list.add(tag2)
        plane5 = Plane.objects.create(author=author3, content='Diet', is_replied = False, is_reported = False,
            latitude = 37.0, longitude = 128.0)
        plane5.set_expiration_date()
        plane5.tag_list.add(tag4)

        plane1.set_is_replied(True)
        plane1.set_is_reported(True)

        self.client = Client()

    def test_write_plane(self):
        response = self.client.post('/api/plane', json.dumps({'author_id': 1, 'content': 'I hate him', 'tag_list': '#love', 
            'latitude': 37.0, 'longitude': 128.0}), content_type='application/json')
        self.assertEqual(response.status_code, 201)
        response = self.client.get('/api/plane/6')
        data = json.loads(response.content.decode())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['author_id'], 1)
        self.assertEqual(data['content'], 'I hate him')
        self.assertEqual(data['tag_list'], '#love')

        response = self.client.post('/api/plane', json.dumps({'author_id': 5, 'content': 'I hate him', 'tag_list': '#love', 
            'latitude': 37.0, 'longitude': 128.0}), content_type='application/json')
        self.assertEqual(response.status_code, 404)

        response = self.client.get('/api/plane')
        self.assertEqual(response.status_code, 405)

    def test_plane_detail(self):
        response = self.client.get('/api/plane/1')
        data = json.loads(response.content.decode())
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['author_id'], 1)
        self.assertEqual(data['content'], 'I am so sad')
        self.assertEqual(data['tag_list'], '#exam')

        response = self.client.get('/api/plane/10')
        self.assertEqual(response.status_code, 404)

        response = self.client.post('/api/plane/1', json.dumps({'author_id': 5, 'content': 'I hate him', 'tag_list': '#love', 
            'latitude': 37.0, 'longitude': 128.0}), content_type='application/json')
        self.assertEqual(response.status_code, 405)

    def test_get_random_planes(self):
        response = self.client.get('/api/plane/random')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 5) # if the number of planes is less than 6
        
        author3 = User.objects.get(id=3)
        Plane.objects.create(author=author3, content='Diet2', is_replied = False, is_reported = False,
            latitude = 37.0, longitude = 128.0)
        Plane.objects.create(author=author3, content='Diet3', is_replied = False, is_reported = False,
            latitude = 37.0, longitude = 128.0)
        response = self.client.get('/api/plane/random')
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 6) # if the number of planes is more than 6
        
        response = self.client.post('/api/plane/random', json.dumps({'author_id': 5, 'content': 'I hate him', 'tag_list': '#love', 
            'latitude': 37.0, 'longitude': 128.0}), content_type='application/json')
        self.assertEqual(response.status_code, 405)

