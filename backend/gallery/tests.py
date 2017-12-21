import io
from django.test import TestCase, Client
from PIL import Image

from gallery.color_picker import *
from .models import Photo
from user.models import User
from level.models import Level
import django.contrib.auth.models as user_model
import json


# Test API about Gallery
class GalleryTestCase(TestCase):
    def setUp(self):
        self.user1 = user_model.User.objects.create_user(username='user1', password='1234')

        level = Level(flavor="Plain", plane_life_span=1, max_today_write=3, max_today_reply=3, next_level_likes=10)
        level.save()

        author1 = User(user=self.user1, today_write_count=3, today_reply_count=3, total_likes=2, level=level)
        author1.save()

        self.photo1 = Photo(image='0.jpg', is_reported=False, color=4, author=author1)
        self.photo1.save()

        self.photo2 = Photo(image='1.jpg', is_reported=False, color=1, author=author1)
        self.photo2.save()

        self.photo3 = Photo(image='2.jpg', is_reported=False, color=2, author=author1)
        self.photo3.save()

        self.photo4 = Photo(image='3.jpg', is_reported=False, color=3, author=author1)
        self.photo4.save()

        self.photo5 = Photo(image='4.jpeg', is_reported=False, color=4, author=author1)
        self.photo5.save()

        self.client = Client()

    def generate_photo_file(self):
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        return file

    def test_photo_list_get(self):
        # Sign-in
        response = self.client.get('/api/photo/random/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 5)

    def test_photo_list_post(self):
        image_file = self.generate_photo_file()

        response = self.client.post('/api/photo/',
                                    {'image': image_file, 'is_reported': 'False', 'color': '5'},
                                    format='multipart')
        self.assertEqual(response.status_code, 400)

    def test_photo_list_get_by_color(self):
        response = self.client.get('/api/photo/color/4/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 2)

    def test_photo_detail_report(self):
        id = self.photo3.id
        response = self.client.put('/api/photo/{}/report/'.format(id),
                                   {},
                                   format='multipart')
        self.assertEqual(response.status_code, 204)

        response = self.client.get('/api/photo/{}/'.format(id))
        data = json.loads(response.content.decode())
        self.assertEqual(data['id'], id)

    def test_photo_detail_delete(self):
        id = self.photo1.id
        response = self.client.delete('/api/photo/{}/'.format(id))
        self.assertEqual(response.status_code, 204)

        response = self.client.get('/api/photo/{}/'.format(id))
        self.assertEqual(response.status_code, 404)

    # def test_not_sky_image_upload(self):
    #     image_file = self.generate_photo_file()
    #     response = self.client.post('/api/photo/upload/',
    #                                 {'author_id': 1, 'image': image_file, 'is_reported': 'False', 'color': '5',
    #                                  'tag': 'study'})
    #     self.assertEqual(response.status_code, 406)
        

# Test for Color Picker
class ColorPickerTestCase(TestCase):
    def generate_photo_file(self):
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        return file

    def test_get_color(self):
        image = self.generate_photo_file()
        color = get_color(image=image)

        self.assertEqual(color, 0)

    def test_classify_color(self):
        red = (1, 0, 0)
        self.assertEqual(classify_color(rgb=red), 0)

        orange = (1, 0.5, 0)
        self.assertEqual(classify_color(rgb=orange), 1)
