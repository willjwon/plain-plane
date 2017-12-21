from os import remove

from .models import Article, Comment
from .classifier import isSky


def fileUpload(request):
    if request.method == 'POST':
        request_file = request.FILES['myfile']
        result_file = './photo/test.jpg'
        with open(result_file, 'wb+') as dest:
            for chunk in request_file.chunks():
                dest.write(chunk)
        if isSky(result_file):
            return HttpResponse(status = 204)
        else:
            remove(result_file)
            return HttpResponse(status = 406)
    else:
        return HttpResponseNotAllowed(['POST'])