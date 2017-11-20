from django.conf.urls import url
import user.views as views

urlpatterns = [
    url(r'^signin$', views.sign_in, name='signin'),
    url(r'^signup$', views.sign_up, name='signup'),
]
