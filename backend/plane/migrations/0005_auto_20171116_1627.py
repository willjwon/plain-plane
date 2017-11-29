# -*- coding: utf-8 -*-
# Generated by Django 1.11.6 on 2017-11-16 16:27
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('plane', '0004_plane_tag_list'),
    ]

    operations = [
        migrations.AddField(
            model_name='plane',
            name='latitude',
            field=models.FloatField(default=-1),
        ),
        migrations.AddField(
            model_name='plane',
            name='longitude',
            field=models.FloatField(default=-1),
        ),
    ]