from datetime import timedelta

from django.utils import timezone


def sm2_update(ease_factor: float, interval: int, repetitions: int, quality_score: int):
    """Apply SM-2 and return updated (ease_factor, interval, repetitions, next_review_date)."""
    if quality_score < 0 or quality_score > 5:
        raise ValueError('quality_score must be between 0 and 5.')

    if quality_score < 3:
        repetitions = 0
        interval = 1
    else:
        repetitions += 1
        if repetitions == 1:
            interval = 1
        elif repetitions == 2:
            interval = 6
        else:
            interval = max(1, round(interval * ease_factor))

    ef_delta = 0.1 - (5 - quality_score) * (0.08 + (5 - quality_score) * 0.02)
    ease_factor = max(1.3, ease_factor + ef_delta)

    next_review_date = timezone.now() + timedelta(days=interval)
    return ease_factor, interval, repetitions, next_review_date
