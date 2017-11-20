from django.conf.urls import url, include
from rest_framework import routers
from .viewsets import PhotoListViewSet

# initiate router and register all endpoints
router = routers.DefaultRouter()
router.register('', PhotoListViewSet, 'photo_list')

# Wire up our API with our urls
urlpatterns = [
    url(r'', include(router.urls)),
]
# urlpatterns = [
#     url(r'^$', views.photo_list, name='photo_list'),
#     url(r'^color/(?P<color_id>[0-7])$', views.photo_list_color, name='photo_list_color'),
#     url(r'^(?P<photo_id>[0-9]+)$', views.photo_detail, name='photo_detail'),
# ]
