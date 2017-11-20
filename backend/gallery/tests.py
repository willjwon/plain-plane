import io

from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.test import TestCase, Client
from PIL import Image
from .models import Photo
import json


# Test API about Gallery
class GalleryTestCase(TestCase):
    def generate_photo_file(self):
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.save(file, 'png')
        file.name = 'test.png'
        file.seek(0)
        return file

    def setUp(self):
        self.photo1 = Photo.objects.create(image='0.jpg', is_reported=False, color=4)
        self.photo2 = Photo.objects.create(image='1.jpg', is_reported=False, color=1)
        self.photo3 = Photo.objects.create(image='2.jpg', is_reported=False, color=2)
        self.photo4 = Photo.objects.create(image='3.jpg', is_reported=False, color=3)
        self.photo5 = Photo.objects.create(image='4.jpeg', is_reported=False, color=4)

        self.client = Client()

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
        self.assertEqual(response.status_code, 201)

    def test_photo_list_get_by_color(self):
        response = self.client.get('/api/photo/color/4/')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 2)

    def test_photo_detail_report(self):
        response = self.client.put('/api/photo/3/report/',
                                    {},
                                    format='multipart')
        self.assertEqual(response.status_code, 204)

        response = self.client.get('/api/photo/3/')
        data = json.loads(response.content.decode())
        self.assertEqual(data['is_reported'], True)

    def test_photo_detail_delete(self):
        response = self.client.delete('/api/photo/3/')
        self.assertEqual(response.status_code, 204)

        response = self.client.get('/api/photo/3/')
        self.assertEqual(response.status_code, 404)