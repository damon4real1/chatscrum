# Generated by Django 2.2.4 on 2019-08-26 09:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Scrum', '0010_scrumworkid'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='scrumworkid',
            options={'ordering': ['-id']},
        ),
    ]
