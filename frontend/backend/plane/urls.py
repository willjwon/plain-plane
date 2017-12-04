from django.conf.urls import url, include
from rest_framework import routers
from .viewsets import PlaneViewSet

# initiate router and register all endpoints
router = routers.DefaultRouter()
router.register('', PlaneViewSet, 'plane')

# Wire up our API with our urls
urlpatterns = [
    url(r'', include(router.urls)),
]
