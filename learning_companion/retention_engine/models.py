from django.conf import settings
from django.db import models
from django.utils import timezone


class Concept(models.Model):
    name = models.CharField(max_length=255, unique=True)
    description = models.TextField(blank=True)
    parent_concept = models.ForeignKey(
        'self',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='child_concepts',
    )

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name


class StudentMastery(models.Model):
    STATUS_CHOICES = (
        ('Green', 'Green'),
        ('Yellow', 'Yellow'),
        ('Red', 'Red'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mastery_records')
    concept = models.ForeignKey(Concept, on_delete=models.CASCADE, related_name='mastery_records')
    ease_factor = models.FloatField(default=2.5)
    interval = models.PositiveIntegerField(default=0)
    repetitions = models.PositiveIntegerField(default=0)
    next_review_date = models.DateTimeField(default=timezone.now)
    status_color = models.CharField(max_length=16, default='Green', choices=STATUS_CHOICES)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'concept')
        ordering = ['next_review_date']

    def __str__(self):
        return f"{self.user} -> {self.concept}"
