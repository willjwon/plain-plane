from django.conf.urls import url
import user.views as views

urlpatterns = [
    url(r'^signin$', views.sign_in, name='signin'),
    url(r'^signup$', views.sign_up, name='signup'),

    url(r'^photo', views.photo_post, name='photo_post'),
    url(r'^photo/random', views.photo_list_random, name='photo_list_random'),
    url(r'^photo/location', views.photo_list_location, name='photo_list_location'),
    url(r'^photo/:tag', views.photo_list_tag, name='photo_list_tag'),
    url(r'^photo/:id', views.photo_detail, name='photo_list_detail'),

]
