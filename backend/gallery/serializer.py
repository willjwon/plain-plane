from .models import Photo
from rest_framework import serializers
from .color_picker import *


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ('id', 'author', 'image', 'tag', 'color')

    def create(self, validated_data):
        author = validated_data['author']
        image = validated_data['image']
        color = get_color(image)
        tag = validated_data['tag']

        photo = Photo(author=author, image=image, is_reported=False, color=color, tag=tag)
        photo.save()

        return photo