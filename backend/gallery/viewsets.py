import uuid

from rest_framework import viewsets, status
from rest_framework.decorators import list_route, detail_route
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from os import remove

import django.contrib.auth.models as user_model
from .serializers import PhotoSerializer
from .models import Photo
from .classifier import isSky

class PhotoViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer

    @list_route()
    def random(self, request):
        photos = Photo.objects.all().filter(is_reported=False).order_by('?')[:9]
        serializer = self.get_serializer(photos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @list_route(url_path='color/(?P<color_id>[0-7])')
    def color(self, request, color_id):
        photos = Photo.objects.all().filter(is_reported=False).filter(color=color_id).order_by('?')[:9]
        serializer = self.get_serializer(photos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # report the photo as a bad photo
    @detail_route(url_path='report', methods=['put'])
    def report(self, request, pk=None):
        queryset = Photo.objects.all()
        photo = get_object_or_404(queryset, pk=pk)
        photo.is_reported = True
        photo.save()
        return Response(status=status.HTTP_204_NO_CONTENT)

    @list_route(url_path='upload', methods=['post'])
    def upload(self, request):
        request_file = request.FILES['image']
        author_id = int(request.data['author_id'])
        tag = request.data['tag']

        file_dir = 'uploaded_images/'
        file_name = "{}.jpg".format(uuid.uuid4())
        file_path = file_dir + file_name

        open(file_path, 'a').close()
        with open(file_path, 'wb+') as dest:
            for chunk in request_file.chunks():
                dest.write(chunk)
        if isSky(file_path):
            author = user_model.User.objects.get(id=author_id).user
            author.decrease_today_write()
            author.save()

            color = PhotoSerializer.get_color(PhotoSerializer(), image=file_path)
            photo = Photo(author=author, image=file_name, is_reported=False, color=color, tag=tag)
            photo.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            remove(file_path)
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)
