from django.forms.models import model_to_dict
from rest_framework import viewsets, status
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
import django.contrib.auth.models as user_model
from .models import Reply


class ReplyViewSet(viewsets.ModelViewSet):
    @list_route(url_path='new', methods=['post'])  # , permission_classes=[IsAuthenticated])
    def write_reply(self, request):
        req_data = request.data
        plane_author_id = req_data['plane_author']
        original_content = req_data['original_content']
        original_tag = req_data['original_tag']
        content = req_data['content']

        plane_author = user_model.User.objects.get(id=plane_author_id).user
        reply_author = user_model.User.objects.get(id=request.user.id).user

        Reply.objects.create(plane_author=plane_author,
                             reply_author=reply_author,
                             original_content=original_content,
                             original_tag=original_tag,
                             content=content,
                             is_reported=False,
                             liked=False)

        return Response(status=status.HTTP_201_CREATED)

    @list_route(url_path="(?P<reply_id>[0-9]+)")#, permission_classes=[IsAuthenticated])
    def get_reply(self, request, reply_id):
        reply = Reply.objects.get(id=reply_id)
        result = model_to_dict(reply)
        result['reply_id'] = result.pop('id')
        return Response(result)

    @list_route(url_path="user/(?P<user_id>[0-9]+)")#, permission_classes=[IsAuthenticated])
    def get_reply_by_user(self, request, user_id):
        user = user_model.User.objects.get(id=user_id).user
        replies = user.replies
        result = []
        for reply in replies.values():
            reply['reply_id'] = reply.pop('id')
            result.append(reply)
        return Response(result)

    @list_route(url_path="report", methods=['put'])#, permission_classes=[IsAuthenticated])
    def report_reply(self, request):
        req_data = request.data
        reply_id = req_data['reply_id']
        try:
            reply = Reply.objects.get(id=reply_id)
        except Reply.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        reply.is_reported = True
        reply.save()
        reply.reply_author.decrease_likes()
        reply.reply_author.save()
        return Response(status=status.HTTP_200_OK)

    @list_route(url_path="like", methods=['put'])#, permission_classes=[IsAuthenticated])
    def like_reply(self, request):
        req_data = request.data
        reply_id = req_data['reply_id']
        try:
            reply = Reply.objects.get(id=reply_id)
        except Reply.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        if reply.liked:
            return Response(status=status.HTTP_406_NOT_ACCEPTABLE)

        reply.liked = True
        reply.save()

        reply.reply_author.increase_likes()
        reply.reply_author.save()
        return Response(status=status.HTTP_200_OK)

    @list_route(url_path="delete", methods=['put'])  # , permission_classes=[IsAuthenticated])
    def delete_reply(self, request):
        req_data = request.data
        plane_id = req_data['reply_id']
        try:
            reply = Reply.objects.get(id=plane_id)
        except Reply.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        reply.delete()
        return Response(status=status.HTTP_200_OK)
