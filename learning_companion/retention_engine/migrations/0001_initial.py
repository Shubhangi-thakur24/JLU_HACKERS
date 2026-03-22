# Generated manually for hackathon bootstrap.

import django.db.models.deletion
import django.utils.timezone
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Concept',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255, unique=True)),
                ('description', models.TextField(blank=True)),
                (
                    'parent_concept',
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name='child_concepts',
                        to='retention_engine.concept',
                    ),
                ),
            ],
            options={'ordering': ['name']},
        ),
        migrations.CreateModel(
            name='StudentMastery',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('ease_factor', models.FloatField(default=2.5)),
                ('interval', models.PositiveIntegerField(default=0)),
                ('repetitions', models.PositiveIntegerField(default=0)),
                ('next_review_date', models.DateTimeField(default=django.utils.timezone.now)),
                (
                    'status_color',
                    models.CharField(
                        choices=[('Green', 'Green'), ('Yellow', 'Yellow'), ('Red', 'Red')],
                        default='Green',
                        max_length=16,
                    ),
                ),
                ('updated_at', models.DateTimeField(auto_now=True)),
                (
                    'concept',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='mastery_records',
                        to='retention_engine.concept',
                    ),
                ),
                (
                    'user',
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name='mastery_records',
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                'ordering': ['next_review_date'],
                'unique_together': {('user', 'concept')},
            },
        ),
    ]
