from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict
from .models import Plane
from tag.models import Tag
from user.models import User
import json

def writePlane(request):

    # TODO: only allow logged user
    #if not request.user.is_authenticated:
    #    return HttpResponse(status=401)

    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        author_id = req_data['author_id']
        content = req_data['content']
        latitude = req_data['latitude']
        longitude = req_data['longitude']
        
        # tags are divided by #
        # e.g. #exam#study
        tag_string = req_data['tag'].replace(' ', '')
        tag_list = tag_string[1:].split('#')
        
        try:
            author = User.objects.get(id=author_id)
        except User.DoesNotExist:
            return HttpResponseNotFound()
        
        new_plane = Plane(author = author, content = content, 
            is_replied = False, is_reported = False,
            latitude = latitude , longitude = longitude)
        new_plane.set_expiration_date()
        new_plane.save()
        for tag in tag_list:
            tag = Tag.objects.create(tag=tag)
            new_plane.tag_list.add(tag)
        return HttpResponse(status=201)
    else:
        # only POST methods are allowed for this url
        return HttpResponseNotAllowed(['POST'])

def planeDetail(request, plane_id):
#    if not request.user.is_authenticated:
#        return HttpResponse(status=401)

    plane_id = int(plane_id)
    if request.method == 'GET':
        try:
            plane = Plane.objects.get(id=plane_id)
        except Plane.DoesNotExist:
            return HttpResponseNotFound()
        
        # Serialize tag_list
        tag_list = plane.tag_list.all()
        tag_string = ''
        for tag in tag_list:
            tag_string = tag_string + '#' + tag.tag
        
        d = model_to_dict(plane)
        d.pop('tag_list')
        d['tag_list'] = tag_string
        d['author_id'] = d.pop('author')
        return JsonResponse(d)
    else:
        # only GET methods are allowed for this url
        return HttpResponseNotAllowed(['GET'])
    