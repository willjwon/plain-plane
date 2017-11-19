from django.http import HttpResponse, HttpResponseNotAllowed, JsonResponse
from django.test import TestCase, Client
from .models import Photo
import json

# Create your tests here.

### Test API about Gallery
from django.core.files import File

class GalleryTestCase(TestCase):
    def setUp(self):
        self.photo1 = Photo.objects.create(image='test/0.jpg', is_reported=False, color=4)
        self.photo2 = Photo.objects.create(image='test/1.jpg', is_reported=False, color=1)
        self.photo3 = Photo.objects.create(image='test/2.jpg', is_reported=False, color=2)
        self.photo4 = Photo.objects.create(image='test/3.jpg', is_reported=False, color=3)
        self.photo5 = Photo.objects.create(image='test/4.jpeg', is_reported=False, color=4)

        self.client = Client()
    def test_photo_list_get(self):
        # Sign-in
        response = self.client.post('/api/signin',
                                    json.dumps({'username': 'Carrot', 'password': '1234'}),
                                    content_type='application/json')

        response = self.client.get('/api/photo')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 5)

    def test_photo_list_post(self):
        # Sign-in
        response = self.client.post('/api/signin',
                                    json.dumps({'username': 'Carrot', 'password': '1234'}),
                                    content_type='application/json')

        image_file = File(open("/Users/kyang/Documents/GitHub/swpp17-team3/backend/user/test/5.jpg"))
        response = self.client.post('/api/photo',
                                    json.dumps({'image': image_file, 'is_report': 'False', 'color': '5'}),
                                    content_type='application/json')

        self.assertEqual(response.status_code, 201)
        data = json.loads(response.content.decode())
        self.assertEqual(len(data), 5)


    def test_photo_list_wrong_method(self):
        # Sign-in
        response = self.client.post('/api/signin',
                                    json.dumps({'username': 'Carrot', 'password': '1234'}),
                                    content_type='application/json')

        # Test with PUT request
        response = self.client.put('/api/photo',
                                   json.dumps({'image': 'test/1', 'is_report': 'False', 'color': '1'}),
                                   content_type='application/json')
        self.assertEqual(response.status_code, 405)

        # Test with DELETE request
        response = self.client.delete('/api/photo')
        self.assertEqual(response.status_code, 405)

        def photo_list(request):
            if request.method == 'GET':
                # get random 9 photos of a specific color
                return JsonResponse(list(Photo.objects.all().values().order_by('?')[:9]), safe=False)

            elif request.method == 'POST':
                request_data = json.loads(request.body.decode())

                # image
                # author = request.user
                image = json.loads(request.body.decode())['image']
                color = json.loads(request.body.decode())['color']
                is_reported = False
                new_photo = Photo(image=image, color=color, is_reported=is_reported)
                new_photo.save()
                return HttpResponse(status=201)

            else:
                return HttpResponseNotAllowed(['GET', 'POST'])