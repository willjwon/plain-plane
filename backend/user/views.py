from django.forms import model_to_dict
from django.http.response import HttpResponseNotAllowed, JsonResponse, HttpResponse, HttpResponseNotFound
from django.contrib.auth import authenticate
import django.contrib.auth.models as user_model
from .models import User
import requests
import json


def sign_up(request):
    if request.method == 'POST':
        # request.body will have 'username', 'password', and 'g-recaptcha-response' attribute.
        # If reCAPTCHA is done but failed, return code '1'.
        # If username is already occupied, return code '2'.
        # If login succeeded, return code '0'.

        request_data = json.loads(request.body.decode())

        # Check the username or password is empty
        username = request_data['username']
        password = request_data['password']
        captcha_key = request_data['g-recaptcha-response']

        # Check reCAPTCHA succeeded or not.
        post_data = {'secret': '6Lf5TDcUAAAAAJKCf060w7eduUXl9P677tqXL1Cg',
                     'response': captcha_key}
        response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=post_data)
        response_data = json.loads(response.content)
        if not response_data['success']:
            return JsonResponse({'success': False, 'error-code': 1})

        # Check the username is available
        try:
            user_model.User.objects.get(username=username)
            return JsonResponse({'success': False, 'error-code': 2})
        except user_model.User.DoesNotExist:
            # Can be signed up at this point.
            user = user_model.User.objects.create_user(username=username, password=password)

            # TODO: Change User Creation. Maybe Using the level, and call initializers after initializing and save?
            User.objects.create(user=user, today_write_count=3, today_reply_count=3, total_likes=2)
            return JsonResponse({'success': True, 'error-code': 0})

    else:
        return HttpResponseNotAllowed(['POST'])


def sign_in(request):
    if request.method == 'POST':
        # request.body will have 'username', 'password', and 'g-recaptcha-response' attribute.
        # If reCAPTCHA is done but failed, return code '1'.
        # If username and password is not matching, return code '2'.
        # If login succeeded, return code '0'.

        request_data = json.loads(request.body.decode())

        # Check the username or password is empty
        username = request_data['username']
        password = request_data['password']
        captcha_key = request_data['g-recaptcha-response']

        # Check reCAPTCHA succeeded or not.
        post_data = {'secret': '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE',
                     'response': captcha_key}
        response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=post_data)
        response_data = json.loads(response.content)
        if not response_data['success']:
            return JsonResponse({'success': False, 'error-code': 1})

        # Check the username and password matches.
        user = authenticate(request, username=username, password=password)
        if user is None:
            # username and password doesn't match.
            return JsonResponse({'success': False, 'error-code': 2})
        else:
            # login succeeded.
            return JsonResponse({'success': True, 'error-code': 0})

    else:
        return HttpResponseNotAllowed(['POST'])
