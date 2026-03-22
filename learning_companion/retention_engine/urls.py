from django.urls import path

from .views import (
    GenerateMCQPromptView,
    RevisionDashboardView,
    RevisionLogView,
    SimulateDayView,
)

urlpatterns = [
    path('revisions/log/', RevisionLogView.as_view(), name='revision-log'),
    path('revisions/generate-mcq/', GenerateMCQPromptView.as_view(), name='generate-mcq'),
    path('revisions/dashboard/', RevisionDashboardView.as_view(), name='revision-dashboard'),
    path('demo/simulate-day/', SimulateDayView.as_view(), name='simulate-day'),
]
