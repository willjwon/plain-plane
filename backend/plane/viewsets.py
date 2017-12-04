from django.forms.models import model_to_dict
from rest_framework import viewsets, status
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import django.contrib.auth.models as user_model
from .models import Plane


class PlaneViewSet(viewsets.ModelViewSet):
    @list_route(url_path='new', methods=['post'], permission_classes=[IsAuthenticated])
    def write_plane(self, request):
        req_data = request.data
        content = req_data['content']
        tag = req_data['tag']

        author = user_model.User.objects.get(id=request.user.id).user

        if req_data['has_location']:
            latitude = req_data['latitude']
            longitude = req_data['longitude']
            new_plane = Plane(author=author, content=content, tag=tag,
                              has_location=True, latitude=latitude, longitude=longitude,
                              is_replied=False, is_reported=False)
        else:
            new_plane = Plane(author=author, content=content, tag=tag,
                              has_location=False, is_replied=False, is_reported=False)

        new_plane.set_expiration_date()
        new_plane.save()

        author.decrease_today_write()
        author.save()

        return Response(status=status.HTTP_201_CREATED)

    @list_route(url_path="(?P<plane_id>[0-9]+)", methods=['get', 'put'], permission_classes=[IsAuthenticated])
    def plane_detail(self, request, plane_id):
        if request.method == "GET":
            plane_id = int(plane_id)
            try:
                plane = Plane.objects.get(id=plane_id)
            except Plane.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            d = model_to_dict(plane)
            result_plane = dict()
            result_plane['author_id'] = d['author']
            result_plane['content'] = d['content']
            result_plane['tag'] = d['tag']
            result_plane['plane_id'] = d['id']

            user = user_model.User.objects.get(id=request.user.id).user
            user.decrease_today_reply()
            user.save()

            plane.add_user_seen(request.user.id)
            plane.save()

            return Response(result_plane)

            # Set is_replied
        elif request.method == 'PUT':
            try:
                plane = Plane.objects.get(id=plane_id)
            except Plane.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)

            if not plane.has_user_seen(request.user.id):
                return Response(status=status.HTTP_403_FORBIDDEN)

            plane.set_is_replied(True)
            plane.save()
            return Response(status=status.HTTP_200_OK)

    @list_route(url_path="report/(?P<plane_id>[0-9]+)", methods=['put'], permission_classes=[IsAuthenticated])
    def report_plane(self, request, plane_id):
        try:
            plane = Plane.objects.get(id=plane_id)
        except Plane.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if not plane.has_user_seen(request.user.id):
            return Response(status=status.HTTP_403_FORBIDDEN)

        plane.set_is_reported(True)
        plane.save()
        return Response(status=status.HTTP_200_OK)

    @list_route(url_path="random", permission_classes=[IsAuthenticated])
    def get_random_plane(self, request):
        # Serialize randomPlanes
        dict_random_planes = []
        random_planes = Plane.objects.all().order_by('?')
        for random_plane in random_planes:
            if random_plane.is_reported or random_plane.is_replied or random_plane.author.user == request.user:
                continue
            
            d = model_to_dict(random_plane)
            plane = dict()
            plane['author_id'] = ""
            plane['content'] = ""
            plane['tag'] = d['tag']
            plane['plane_id'] = d['id']
            dict_random_planes.append(plane)

            if len(dict_random_planes) >= 6:
                break

        return Response(dict_random_planes)

    @list_route(url_path="delete", methods=['put'], permission_classes=[IsAuthenticated])
    def delete_plane(self, request):
        req_data = request.data
        plane_id = req_data['plane_id']
        try:
            plane = Plane.objects.get(id=plane_id)
        except Plane.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if not plane.has_user_seen(request.user.id):
            return Response(status=status.HTTP_403_FORBIDDEN)

        plane.delete()
        return Response(status=status.HTTP_200_OK)
