from django.http import HttpResponseRedirect
from django.utils.encoding import force_text
from django.utils.http import urlsafe_base64_decode
from django.shortcuts import redirect, render_to_response
from django.contrib import messages
from .tokens import email_verification_token
from .models import User


def email_verified(request, uidb64, token):
    try:
        uid = force_text(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None
    if user is not None and email_verification_token.check_token(user, token):
        user.email_verified = True
        user.save()
        return render_to_response('verified.html', {'message': 'Your email is successfully verified.'})
    else:
        return render_to_response('verified.html', {'message': 'Sorry. This link is not valid.'})
