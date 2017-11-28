from .models import Photo
from rest_framework import serializers
from PIL import Image


class PhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Photo
        fields = ('image', 'is_reported', 'color')

    def get_color(self, image):

        image = Image.open(image)
        width = image.size[0]
        height = image.size[1]

        image = image.resize((int(100 * width / height), int(100 * height / width)))

        width = image.size[0]
        height = image.size[1]
        print(width, height)
        image = image.convert('RGB')

        color_frequency = [0, 0, 0, 0, 0, 0]

        for x in range(width):
            for y in range(height):
                pixel_rgb = image.getpixel((x, y))
                color_index = self.classify_color(pixel_rgb)
                color_frequency[color_index] += 1

        print(color_frequency)
        return color_frequency.index(max(color_frequency))

    def classify_color(self, rgb):
        def distance(vector):
            distance_square = 0
            for i in range(3):
                distance_square += vector[i] ** 2
            if distance_square == 0:
                return 0.0001
            return distance_square ** 0.5

        def cosine_similarity(color, rgb):
            similarity = 0
            for i in range(3):
                similarity += color[i] * rgb[i]

            return similarity / (distance(color) * distance(rgb))

        # colors = [(255, 0, 0),  # red
        #           (255, 127, 0),  # orange
        #           (255, 255, 0),  # yellow
        #           (0, 255, 0),  # green
        #           (0, 0, 255),  # blue
        #           (143, 0, 255),  # purple
        #           ]
        colors = [(1, 0, 0),  # red
                  (1, 0.5, 0),  # orange
                  (1, 0.8, 0),  # yellow
                  (0, 1, 0),  # green
                  (0, 0.5, 1),  # blue
                  (0.5, 0, 1),  # purple
                  ]
        cosine_similarity = list(map(lambda color: cosine_similarity(color, rgb), colors))
        return cosine_similarity.index(max(cosine_similarity))

    def create(self, validated_data):
        image = validated_data['image']
        color = self.get_color(image)

        photo = Photo(image=image, is_reported=False, color=color)
        photo.save()

        return photo

