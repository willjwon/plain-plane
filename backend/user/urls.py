from django.conf.urls import url
import user.views as views

urlpatterns = [
    url(r'^signin$', views.sign_in, name='signin'),
    url(r'^signup$', views.sign_up, name='signup'),

    url(r'^photo$', views.photo_list, name='photo_list'),
    url(r'^photo/(?P<photo_color>(RED|ORANGE|YELLOW|GREEN|BLUE|INDIGO|VIOLET|BLACK))$', views.photo_list_color, name='photo_list_color'),
    url(r'^photo/(?P<photo_id>[0-9]+)$', views.photo_detail, name='photo_detail'),
]
