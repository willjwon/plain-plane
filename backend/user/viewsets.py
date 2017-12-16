from django.contrib.sites.shortcuts import get_current_site
from django.forms import model_to_dict
from django.template.loader import render_to_string
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from rest_framework import viewsets, status
from rest_framework.decorators import list_route
from rest_framework.response import Response
from django.contrib.auth import authenticate, login, logout
import django.contrib.auth.models as user_model
from django.core.mail import EmailMessage
from rest_framework.permissions import IsAuthenticated
from .models import User
from .tokens import email_verification_token
import json
import requests
import random
import string


class UserViewSet(viewsets.ModelViewSet):
    @staticmethod
    def check_captcha(secret_key, captcha_key):
        # Check reCAPTCHA succeeded or not.
        post_data = {'secret': secret_key,
                     'response': captcha_key}
        response = requests.post('https://www.google.com/recaptcha/api/siteverify', data=post_data)
        response_data = json.loads(response.content.decode('utf-8'))
        return response_data['success']

    @staticmethod
    def random_password(password_length):
        return "".join(
            random.choices(string.ascii_lowercase + string.ascii_uppercase + string.digits, k=password_length))

    @list_route(url_path='check', methods=['post'])
    def check_user_available(self, request):
        try:
            request_data = request.data
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

        request_data = request.data

        # Check the username or password is empty
        try:
            username = request_data['username']
            password = request_data['password']
            captcha_key = request_data['g-recaptcha-response']
        except KeyError:
            return Response({'success': False, 'error-code': 1})

        # Check reCAPTCHA succeeded or not.
        if not self.check_captcha('6LdqTDcUAAAAAMg6MerfUa0BZAnpVb7NnerIfZgE', captcha_key):
            return Response({'success': False, 'error-code': 2})

        # Check the username and password matches.
        user = authenticate(request, username=username, password=password)
        if user is None:
            # username and password doesn't match.
            return Response({'success': False, 'error-code': 3})
        else:
            # login succeeded
            login(request, user)
            return Response({'success': True, 'error-code': 0})

    @list_route(url_path='sign_up', methods=['post'])
    def sign_up(self, request):
        # request.body must have 'username', 'password', and 'g-recaptcha-response' attribute.
        # If attribute is wrong, return code '1'.
        # If reCAPTCHA is done but failed, return code '2'.
        # If username is already occupied, return code '3'.
        # If login succeeded, return code '0'.

        request_data = request.data

        # Check the key
        try:
            username = request_data['username']
            password = request_data['password']
            captcha_key = request_data['g-recaptcha-response']
        except KeyError:
            return Response({'success': False, 'error-code': 1})

        # Check reCAPTCHA succeeded or not.
        if not self.check_captcha('6Lf5TDcUAAAAAJKCf060w7eduUXl9P677tqXL1Cg', captcha_key):
            return Response({'success': False, 'error-code': 2})

        # Check the username is available
        try:
            user_model.User.objects.get(username=username)
            return Response({'success': False, 'error-code': 3})
        except user_model.User.DoesNotExist:
            # Can be signed up at this point.
            django_user = user_model.User.objects.create_user(username=username, password=password)

            # TODO: Change User Creation. Maybe Using the level, and call initializers after initializing and save?
            user = User(user=django_user,
                        email_verified=False,
                        today_write_count=10,
                        today_reply_count=10,
                        total_likes=0)
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
                email_to_send = EmailMessage(mail_subject, message, to=[email])
                email_to_send.send()

                user.user.email = email
                user.user.save()

            return Response({'success': True, 'error-code': 0})

    @list_route(url_path="find_password", methods=['post'])
    def find_password(self, request):
        # 1. Check the given username and email
        # 2. If key error, return {False, 1}
        # 2. If captcha fails, return {False, 2}
        # 3. If the username does not exists, return {False, 3}
        # 4. If the username exists but email is not set or verified, return {False, 4}
        # 5. If the username and email doesn't match, return {False, 5}
        # 6. If the username exists and the email is verified, change the email and return {True, 0}

        request_data = request.data

        # Check the key
        try:
            username = request_data['username']
            email = request_data['email']
            captcha_key = request_data['g-recaptcha-response']
        except KeyError:
            return Response({'success': False, 'error-code': 1})

        # Check reCAPTCHA succeeded or not.
        if not self.check_captcha('6LfhcjsUAAAAAOWK76dOZ0TWZiJksnlZ3Miq1_85', captcha_key):
            return Response({'success': False, 'error-code': 2})

        # Check the username exists
        try:
            user = user_model.User.objects.get(username=username).user
        except user_model.User.DoesNotExist:
            return Response({'success': False, 'error-code': 3})

        # check the user has verified email
        if not user.email_verified:
            return Response({'success': False, 'error-code': 4})

        # validate the user
        if user.user.email != email:
            return Response({'success': False, 'error-code': 5})

        # change the password and alert it to the user.
        new_password = self.random_password(8)
        user.user.set_password(new_password)
        user.user.save()

        email = email
        message = render_to_string('new_password_email.html', {
            'username': username,
            'password': new_password
        })
        mail_subject = 'Your Requested Temporary Password at Plain Plane'
        email_to_send = EmailMessage(mail_subject, message, to=[email])
        email_to_send.send()
        return Response({'success': True, 'error-code': 0})

    @list_route(url_path='get', permission_classes=[IsAuthenticated])
    def get_signed_in_user(self, request):
        user = user_model.User.objects.get(id=request.user.id).user
        user_dict = model_to_dict(user)
        user_dict['username'] = user.user.username
        del user_dict['id']
        return Response(user_dict)

    @list_route(url_path='sign_out')
    def sign_out(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
