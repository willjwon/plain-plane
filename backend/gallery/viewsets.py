from rest_framework import viewsets, filters, status
from rest_framework.decorators import list_route, detail_route
from rest_framework.generics import get_object_or_404
from rest_framework.response import Response
from .serializers import PhotoSerializer
from .models import Photo


class PhotoListViewSet(viewsets.ModelViewSet):
    queryset = Photo.objects.all()
    serializer_class = PhotoSerializer

    @list_route()
    def random(self, request):
        photos = Photo.objects.all().order_by('?')[:9]
        serializer = self.get_serializer(photos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @list_route(url_path='color/(?P<color_id>[0-7])')
    def color(self, request, color_id):
        photos = Photo.objects.all().filter(color=color_id).order_by('?')[:9]
        serializer = self.get_serializer(photos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    # report the photo as a bad photo
    @detail_route(methods=['put'])
    def report(self, request, pk=None):
        queryset = Photo.objects.all()
        photo = get_object_or_404(queryset, pk=pk)
        photo.is_reported = True
        photo.save()
        serializer = PhotoSerializer(photo)
        return Response(status=status.HTTP_204_NO_CONTENT)


