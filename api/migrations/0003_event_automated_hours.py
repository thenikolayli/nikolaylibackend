# Generated by Django 5.1 on 2024-08-21 07:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_event_automated_timestamp'),
    ]

    operations = [
        migrations.AddField(
            model_name='event_automated',
            name='hours',
            field=models.FloatField(default=0.0),
        ),
    ]
