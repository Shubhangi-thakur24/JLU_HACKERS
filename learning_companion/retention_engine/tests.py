from datetime import timedelta

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import timezone
from rest_framework.test import APIClient

from .models import Concept, StudentMastery
from .utils import sm2_update


class SM2AlgorithmTests(TestCase):
    def test_sm2_low_quality_resets_repetitions_and_sets_interval_one(self):
        ef, interval, reps, next_date = sm2_update(2.5, 6, 2, 2)
        self.assertEqual(interval, 1)
        self.assertEqual(reps, 0)
        self.assertGreaterEqual(ef, 1.3)
        self.assertGreater(next_date, timezone.now())

    def test_sm2_high_quality_grows_interval(self):
        ef, interval, reps, _ = sm2_update(2.5, 6, 2, 5)
        self.assertEqual(reps, 3)
        self.assertEqual(interval, round(6 * 2.5))
        self.assertGreaterEqual(ef, 1.3)


class RetentionEngineApiTests(TestCase):
    def setUp(self):
        user_model = get_user_model()
        self.user = user_model.objects.create_user(username='api_user', password='api_pass_123')
        self.parent = Concept.objects.create(name='Parent Concept', description='Parent')
        self.child = Concept.objects.create(
            name='Child Concept',
            description='Child',
            parent_concept=self.parent,
        )
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

    def test_generate_mcq_endpoint(self):
        response = self.client.post('/api/revisions/generate-mcq/', {'concept_id': self.child.id}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertIn('llm_prompt', response.data)

    def test_domino_effect_schedules_parent_today(self):
        response = self.client.post(
            '/api/revisions/log/',
            {'concept_id': self.child.id, 'quality_score': 2},
            format='json',
        )
        self.assertEqual(response.status_code, 200)
        self.assertIsNotNone(response.data['parent_concept_scheduled_today'])

        parent_mastery = StudentMastery.objects.get(user=self.user, concept=self.parent)
        self.assertEqual(parent_mastery.next_review_date.date(), timezone.now().date())

    def test_dashboard_returns_color_code(self):
        StudentMastery.objects.create(
            user=self.user,
            concept=self.child,
            next_review_date=timezone.now() - timedelta(days=1),
            status_color='Red',
        )
        response = self.client.get('/api/revisions/dashboard/')
        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data['concepts']), 1)
        child_row = [c for c in response.data['concepts'] if c['concept_id'] == self.child.id][0]
        self.assertEqual(child_row['color_code'], 'Red')

    def test_simulate_day_shifts_dates_by_one_day(self):
        mastery = StudentMastery.objects.create(
            user=self.user,
            concept=self.child,
            next_review_date=timezone.now() + timedelta(days=3),
            status_color='Green',
        )
        before = mastery.next_review_date

        response = self.client.post('/api/demo/simulate-day/', {}, format='json')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['records_updated'], 1)

        mastery.refresh_from_db()
        self.assertEqual(mastery.next_review_date.date(), (before - timedelta(days=1)).date())
