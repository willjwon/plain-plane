from django.contrib.sites.shortcuts import get_current_site
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django.contrib.auth import authenticate
import django.contrib.auth.models as user_model
from django.core.mail import EmailMessage
from .models import User
from .tokens import email_verification_token
import json
import requests


class UserViewSet(viewsets.ModelViewSet):
    @list_route(url_path='check', methods=['post'])
    def get_user(self, request):
        try:
            request_data = json.loads(request.body.decode())
            username = request_data['username']
            user_model.User.objects.get(username=username)
            return Response({'available': False})
        except user_model.User.DoesNotExist:
            return Response({'available': True})

    @list_route(url_path='sign_in', methods=['post'])
    def sign_in(self, request):
        # request.body must have 'username', 'password', and 'g-recaptcha-response' attribute.
        # If attribute is wrong, return code '1'.
        # If reCAPTCHA is done but failed, return code '2'.
        # If username and password is not matching, return code '3'.
        # If login succeeded, return code '0'.

        request_data = json.loads(request.body.decode())

        # Check the username or password is empty
        try:
            username = request_data['username']
            password = request_data['password']
            captcha_key = request_data['g-recaptcha-response']
        except KeyError:
            return Response({'success': False, 'error-code': 1})

        # Check reCAPTCHA succeeded or not.
        post_data = {'secret': '6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE',
                     'response': captcha_key}
        response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=post_data)
        response_data = json.loads(response.content)
        if not response_data['success']:
            return Response({'success': False, 'error-code': 2})

        # Check the username and password matches.
        user = authenticate(request, username=username, password=password)
        if user is None:
            # username and password doesn't match.
            return Response({'success': False, 'error-code': 3})
        else:
            # login succeeded.
            return Response({'success': True, 'error-code': 0})

    @list_route(url_path='sign_up', methods=['post'])
    def sign_up(self, request):
        # request.body must have 'username', 'password', and 'g-recaptcha-response' attribute.
        # If attribute is wrong, return code '1'.
        # If reCAPTCHA is done but failed, return code '2'.
        # If username is already occupied, return code '3'.
        # If login succeeded, return code '0'.

        request_data = json.loads(request.body.decode())

        # Check the key
        try:
            username = request_data['username']
            password = request_data['password']
            captcha_key = request_data['g-recaptcha-response']
        except KeyError:
            return Response({'success': False, 'error-code': 1})

        # Check reCAPTCHA succeeded or not.
        post_data = {'secret': '6Lf5TDcUAAAAAJKCf060w7eduUXl9P677tqXL1Cg',
                     'response': captcha_key}
        response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=post_data)
        response_data = json.loads(response.content)
        if not response_data['success']:
            return Response({'success': False, 'error-code': 2})

        # Check the username is available
        try:
            user_model.User.objects.get(username=username)
            return Response({'success': False, 'error-code': 3})
        except user_model.User.DoesNotExist:
            # Can be signed up at this point.
            django_user = user_model.User.objects.create_user(username=username, password=password)

            # TODO: Change User Creation. Maybe Using the level, and call initializers after initializing and save?
            user = User(user=django_user, email_verified=False, today_write_count=3, today_reply_count=3, total_likes=2)
            user.save()

            # if email field is not empty, send the verification email.
            if 'email' in request_data:
                email = request_data['email']
                current_site = get_current_site(request)
                message = render_to_string('verification_email.html', {
                    'username': username,
                    'domain': current_site.domain,
                    'uid': urlsafe_base64_encode(force_bytes(user.pk)),
                    'token': email_verification_token.make_token(user),
                })
                mail_subject = 'Please Verify Your Email Address at Plain Plane'
                to_email = email
                email = EmailMessage(mail_subject, message, to=[to_email])
                email.send()

                user.user.email = email
                user.save()

            return Response({'success': True, 'error-code': 0})
