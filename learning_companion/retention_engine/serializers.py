from django.utils import timezone
from rest_framework import serializers

from .models import Concept, StudentMastery


class RevisionLogSerializer(serializers.Serializer):
    concept_id = serializers.IntegerField(min_value=1)
    quality_score = serializers.IntegerField(min_value=0, max_value=5)


class GenerateMCQSerializer(serializers.Serializer):
    concept_id = serializers.IntegerField(min_value=1)


class DashboardConceptSerializer(serializers.Serializer):
    concept_id = serializers.IntegerField()
    concept_name = serializers.CharField()
    description = serializers.CharField()
    parent_concept_id = serializers.IntegerField(allow_null=True)
    ease_factor = serializers.FloatField()
    interval = serializers.IntegerField()
    repetitions = serializers.IntegerField()
    next_review_date = serializers.DateTimeField()
    color_code = serializers.CharField()


def calculate_color_code(next_review_date):
    today = timezone.localdate()
    review_date = timezone.localtime(next_review_date).date()
    if review_date < today:
        return 'Red'
    if review_date == today:
        return 'Yellow'
    return 'Green'


class StudentMasterySerializer(serializers.ModelSerializer):
    color_code = serializers.SerializerMethodField()

    class Meta:
        model = StudentMastery
        fields = (
            'concept',
            'ease_factor',
            'interval',
            'repetitions',
            'next_review_date',
            'status_color',
            'color_code',
        )

    def get_color_code(self, obj):
        return calculate_color_code(obj.next_review_date)


class ConceptSerializer(serializers.ModelSerializer):
    class Meta:
        model = Concept
        fields = ('id', 'name', 'description', 'parent_concept')
