from django.contrib import admin

from .models import Concept, StudentMastery


@admin.register(Concept)
class ConceptAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'parent_concept')
    search_fields = ('name',)
    list_filter = ('parent_concept',)


@admin.register(StudentMastery)
class StudentMasteryAdmin(admin.ModelAdmin):
    list_display = (
        'id',
        'user',
        'concept',
        'ease_factor',
        'interval',
        'repetitions',
        'next_review_date',
        'status_color',
    )
    search_fields = ('user__username', 'concept__name')
    list_filter = ('status_color',)
