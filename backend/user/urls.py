from django.conf.urls import url, include
from rest_framework import routers
from .viewsets import UserViewSet
from .views import email_verified

router = routers.DefaultRouter()
router.register(r'', UserViewSet, 'user')

# Wire up our API with our urls
urlpatterns = [
    url(r'', include(router.urls)),
]
