# Generated by Django 2.1.7 on 2019-05-24 15:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Scrum', '0007_auto_20190520_1230'),
    ]

    operations = [
        migrations.AddField(
            model_name='scrumproject',
            name='to_clear_TFT',
            field=models.BooleanField(default=True),
        ),
    ]