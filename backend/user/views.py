from django.http.response import HttpResponseNotAllowed, JsonResponse
from django.contrib.auth import authenticate
import django.contrib.auth.models as user_model
from .models import User
import urllib.parse
import requests


def sign_up(request):
    if request.method == 'POST':
        # request.body will have 'username', 'password', and 'g-recaptcha-response' attribute.
        # If username or password is empty, return code '1'.
        # If password fields are not matching, return code '2'.
        # If reCAPTCHA is not done, return code '3'.
        # If reCAPTCHA is done but failed, return code '4'.
        # If username is already occupied, return code '5'.
        # If login succeeded, return code '0'.

        request_data = dict(urllib.parse.parse_qsl(request.body.decode()))

        # Check the username or password is empty
        username = request_data['username']
        password = request_data['password']
        password_check = request_data['password_check']

        if len(username) == 0 or len(password) == 0 or len(password_check) == 0:
            return JsonResponse({'success': False, 'error-code': 1})

        # Check the password field is matching
        if password != password_check:
            return JsonResponse({'success': False, 'error-code': 2})

        # Check the reCAPTCHA status
        if 'g-recaptcha-response' not in request_data:
            # User didn't finished reCAPTCHA.
            return JsonResponse({'success': False, 'error-code': 3})
        else:
            # Check reCAPTCHA succeeded or not.
            post_data = {'secret': '6Lf5TDcUAAAAAJKCf060w7eduUXl9P677tqXL1Cg',
                         'response': request_data['g-recaptcha-response']}
            response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=post_data)
            if not response.content['success']:
                return JsonResponse({'success': False, 'error-code': 4})

        # Check the username is available
        if len(user_model.User.objects.get(username=username)) != 0:
            return JsonResponse({'success': False, 'error-code': 5})

        # Can be signed up at this point.
        user = user_model.User(username=username, password=password)
        user.save()

        # TODO: Change User Creation. Maybe Using the level, and call initializers after initializing and save?
        User.objects.create(user=user, today_write_count=3, today_reply_count=3, total_likes=2)
        return JsonResponse({'success': True, 'error-code': 0})

    else:
        return HttpResponseNotAllowed(['POST'])


def sign_in(request):
    if request.method == 'POST':
        # request.body will have 'username', 'password', and 'g-recaptcha-response' attribute.
        # If username or password is empty, return code '1'.
        # If reCAPTCHA is not done, return code '2'.
        # If reCAPTCHA is done but failed, return code '3'.
        # If username and password is not matching, return code '4'.
        # If login succeeded, return code '0'.

        request_data = dict(urllib.parse.parse_qsl(request.body.decode()))

        # Check the username or password is empty
        username = request_data['username']
        password = request_data['password']

        if len(username) == 0 or len(password) == 0:
            return JsonResponse({'success': False, 'error-code': 1})

        # Check the reCAPTCHA status
        if 'g-recaptcha-response' not in request_data:
            # User didn't finished reCAPTCHA.
            return JsonResponse({'success': False, 'error-code': 2})
        else:
            # Check reCAPTCHA succeeded or not.
            post_data = {'secret': '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE',
                         'response': request_data['g-recaptcha-response']}
            response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=post_data)
            if not response.content['success']:
                return JsonResponse({'success': False, 'error-code': 3})

        # Check the username and password matches.
        user = authenticate(request, username=username, password=password)
        if user is None:
            # username and password doesn't match.
            return JsonResponse({'success': False, 'error-code': 4})
        else:
            # login succeeded.
            return JsonResponse({'success': False, 'error-code': 0})

    else:
        return HttpResponseNotAllowed(['POST'])
