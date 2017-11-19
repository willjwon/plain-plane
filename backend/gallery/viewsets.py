from rest_framework import viewsets
from django.forms import model_to_dict
from django.http.response import HttpResponseNotAllowed, JsonResponse, HttpResponse, HttpResponseNotFound
from .models import Photo
import requests
import json
from .PhotoSerializer import PhotoSerializer


class GalleryViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer

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


def photo_list_color(request, color_id):
    # get random 9 photos of a specific color
    if request.method == 'GET':
        return JsonResponse(list(Photo.objects.all().values()
                                 .filter(lambda photo: photo.color == color_id)
                                 .order_by('?')[:9])
                            , safe=False)
    else:
        return HttpResponseNotAllowed(['GET'])


def photo_detail(request, photo_id):
    photo_id = int(photo_id)
    try:
        photo = Photo.objects.get(id=photo_id)
    except Photo.DoesNotExist:
        return HttpResponseNotFound()

    if request.method == 'GET':
        photo_dict = model_to_dict(photo)
        return JsonResponse(photo_dict)
    elif request.method == 'PUT':
        is_reported = json.loads(request.body.decode())['is_report']
        photo.is_reported = True
        photo.save()
        return HttpResponse(status=204)   # 204: No content
    elif request.method == 'DELETE':
        if request.user != photo.author:
            return HttpResponse(status=403)

        photo.delete()
        return HttpResponse(status=204)   # 204: No content
    else:
        return HttpResponseNotAllowed(['GET', 'PUT', 'DELETE'])