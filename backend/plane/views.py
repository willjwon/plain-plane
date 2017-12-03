from django.http import HttpResponse, HttpResponseNotAllowed
from django.http import HttpResponseNotFound, JsonResponse
from django.forms.models import model_to_dict
from .models import Plane
from tag.models import Tag
from user.models import User
import json

def writePlane(request):
    if not request.user.is_authenticated:
        return HttpResponse(status=401)

    # TODO: define error code
    if request.method == 'POST':
        req_data = json.loads(request.body.decode())
        content = req_data['content']
        latitude = req_data['latitude']
        longitude = req_data['longitude']
        
        # tags are divided by #  e.g. #exam#study
        tag_string = req_data['tag_list'].replace(' ', '')
        tag_list = tag_string[1:].split('#')

        author = User.objects.get(user__id = request.user.id)
        
        new_plane = Plane(author = author, content = content, 
            is_replied = False, is_reported = False,
            latitude = latitude , longitude = longitude)
        new_plane.set_expiration_date()
        new_plane.save()
        for tag in tag_list:
            tag = Tag.objects.create(tag=tag)
            new_plane.tag_list.add(tag)
        author.decrease_today_write()
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
        
        d = model_to_dict(plane)
        d.pop('tag_list')
        d['tag_list'] = plane.get_tag_list() # { "tag_list": #tag1#tag2 }
        d['author_id'] = d.pop('author')
        return JsonResponse(d)
    
    # Set is_replied
#    elif request.method == 'PUT':
#        try:
#            plane = Plane.objects.get(id=plane_id)
#        except Plane.DoesNotExist:
#            return HttpResponseNotFound()

#        plane.set_is_replied(True)
#        plane.save()
#        return HttpResponse(status=200)

    else:
        # only GET methods are allowed for this url
        return HttpResponseNotAllowed(['GET'])

def getRandomPlane(request):
#    if not request.user.is_authenticated:
#        return HttpResponse(status=401)

    if request.method == 'GET':
        # get 6 planes randomly
        randomPlanes = Plane.objects.all().order_by('?')[:6]
        
        # Serialize randomPlanes
        dictRandomPlanes = []
        for randomPlane in randomPlanes:
            d = model_to_dict(randomPlane)
            d.pop('tag_list')
            d['tag_list'] = randomPlane.get_tag_list() # { "tag_list": #tag1#tag2 } in json
            d['author_id'] = d.pop('author')
            dictRandomPlanes.append(d)

        return JsonResponse(dictRandomPlanes, safe=False)

    else:
        # only GET methods are allowed for this url
        return HttpResponseNotAllowed(['GET'])

# TODO: getNearPlane()
# get 6 planes by location
"""
def distance(lon1, lat1, lon2, lat2):
    # Calculate the great circle distance between two points on the earth (specified in decimal degrees)
    # convert decimal degrees to radians 
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])
    # haversine formula 
    dlon = lon2 - lon1 
    dlat = lat2 - lat1 
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a)) 
    # Radius of earth in kilometers is 6371
    km = 6371* c
    return km
"""