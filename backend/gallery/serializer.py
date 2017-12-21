from .models import Photo
from rest_framework import serializers
from .color_picker import *


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ('id', 'author', 'image', 'is_reported', 'tag', 'color')
