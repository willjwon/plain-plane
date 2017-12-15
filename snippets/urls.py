from django.conf.urls import url
from blog import views

urlpatterns = [
    url('^upload$', views.fileUpload, name='upload'),
]
