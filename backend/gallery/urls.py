from django.conf.urls import url
import gallery.views as views

urlpatterns = [
    url(r'^$', views.photo_list, name='photo_list'),
    url(r'^color/(?P<color_id>[0-7])$', views.photo_list_color, name='photo_list_color'),
    url(r'^(?P<photo_id>[0-9]+)$', views.photo_detail, name='photo_detail'),
]
