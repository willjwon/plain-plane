from django.conf.urls import url
from plane import views

urlpatterns = [
    url(r'^plane$', views.writePlane, name='writePlane'),
    url(r'^plane/(?P<plane_id>[0-9]+)$', views.planeDetail, name='planeDetail')
]
