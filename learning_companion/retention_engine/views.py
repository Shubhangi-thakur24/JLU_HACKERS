from datetime import timedelta

from django.db import transaction
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Concept, StudentMastery
from .serializers import (
    DashboardConceptSerializer,
    GenerateMCQSerializer,
    RevisionLogSerializer,
    calculate_color_code,
)
from .utils import sm2_update


class RevisionLogView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        serializer = RevisionLogSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        concept = get_object_or_404(Concept, id=serializer.validated_data['concept_id'])
        quality_score = serializer.validated_data['quality_score']

        mastery, _ = StudentMastery.objects.select_for_update().get_or_create(
            user=request.user,
            concept=concept,
            defaults={
                'ease_factor': 2.5,
                'interval': 0,
                'repetitions': 0,
                'next_review_date': timezone.now(),
                'status_color': 'Green',
            },
        )

        (
            mastery.ease_factor,
            mastery.interval,
            mastery.repetitions,
            mastery.next_review_date,
        ) = sm2_update(
            ease_factor=mastery.ease_factor,
            interval=mastery.interval,
            repetitions=mastery.repetitions,
            quality_score=quality_score,
        )

        mastery.status_color = calculate_color_code(mastery.next_review_date)
        mastery.save()

        parent_scheduled = None
        if quality_score < 3 and concept.parent_concept_id:
            parent_mastery, _ = StudentMastery.objects.select_for_update().get_or_create(
                user=request.user,
                concept=concept.parent_concept,
                defaults={
                    'ease_factor': 2.5,
                    'interval': 0,
                    'repetitions': 0,
                    'next_review_date': timezone.now(),
                    'status_color': 'Yellow',
                },
            )
            parent_mastery.next_review_date = timezone.now()
            parent_mastery.status_color = 'Yellow'
            parent_mastery.save(update_fields=['next_review_date', 'status_color', 'updated_at'])
            parent_scheduled = {
                'concept_id': concept.parent_concept.id,
                'concept_name': concept.parent_concept.name,
                'next_review_date': parent_mastery.next_review_date,
            }

        return Response(
            {
                'message': 'Revision logged successfully.',
                'concept': {
                    'concept_id': concept.id,
                    'concept_name': concept.name,
                    'quality_score': quality_score,
                    'ease_factor': mastery.ease_factor,
                    'interval': mastery.interval,
                    'repetitions': mastery.repetitions,
                    'next_review_date': mastery.next_review_date,
                    'color_code': mastery.status_color,
                },
                'parent_concept_scheduled_today': parent_scheduled,
            },
            status=status.HTTP_200_OK,
        )


class GenerateMCQPromptView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = GenerateMCQSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        concept = get_object_or_404(Concept, id=serializer.validated_data['concept_id'])

        prompt_payload = {
            'task': 'Generate one high-quality MCQ for spaced repetition revision.',
            'concept': {
                'id': concept.id,
                'name': concept.name,
                'description': concept.description,
                'parent_concept': concept.parent_concept.name if concept.parent_concept else None,
            },
            'constraints': {
                'difficulty': 'adaptive',
                'output_format': {
                    'question': 'string',
                    'options': ['string', 'string', 'string', 'string'],
                    'correct_option_index': 'integer (0-3)',
                    'explanation': 'string',
                },
                'rules': [
                    'Only one correct answer.',
                    'Distractors should be plausible.',
                    'Question should test conceptual understanding, not pure memorization.',
                ],
            },
        }

        return Response(
            {
                'concept_id': concept.id,
                'concept_name': concept.name,
                'llm_prompt': prompt_payload,
            },
            status=status.HTTP_200_OK,
        )


class RevisionDashboardView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        concepts = Concept.objects.select_related('parent_concept').all()
        mastery_map = {
            mastery.concept_id: mastery
            for mastery in StudentMastery.objects.filter(user=request.user).select_related('concept')
        }

        data = []
        for concept in concepts:
            mastery = mastery_map.get(concept.id)
            if mastery:
                next_review_date = mastery.next_review_date
                ease_factor = mastery.ease_factor
                interval = mastery.interval
                repetitions = mastery.repetitions
            else:
                # New concepts are considered due today until first revision happens.
                next_review_date = timezone.now()
                ease_factor = 2.5
                interval = 0
                repetitions = 0

            data.append(
                {
                    'concept_id': concept.id,
                    'concept_name': concept.name,
                    'description': concept.description,
                    'parent_concept_id': concept.parent_concept_id,
                    'ease_factor': ease_factor,
                    'interval': interval,
                    'repetitions': repetitions,
                    'next_review_date': next_review_date,
                    'color_code': calculate_color_code(next_review_date),
                }
            )

        serializer = DashboardConceptSerializer(data, many=True)
        return Response({'concepts': serializer.data}, status=status.HTTP_200_OK)


class SimulateDayView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    @transaction.atomic
    def post(self, request):
        records = StudentMastery.objects.select_for_update().all()

        updated = 0
        for mastery in records:
            mastery.next_review_date = mastery.next_review_date - timedelta(days=1)
            mastery.status_color = calculate_color_code(mastery.next_review_date)
            mastery.save(update_fields=['next_review_date', 'status_color', 'updated_at'])
            updated += 1

        return Response(
            {
                'message': 'Simulation complete. Shifted next_review_date by -1 day.',
                'records_updated': updated,
                'simulated_at': timezone.now(),
            },
            status=status.HTTP_200_OK,
        )
