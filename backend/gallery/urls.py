from django.conf.urls import url, include
from rest_framework import routers
from gallery.viewsets import GalleryViewSet

router = routers.DefaultRouter()
router.register('', GalleryViewSet, 'photo')

urlpatterns = [
    url(r'^', include(router.urls)),
]
