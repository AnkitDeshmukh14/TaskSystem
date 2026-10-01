from django.contrib import admin
from .models import Task

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = (
        'code',
        'name',
        'priority',
        'status',
        'due_date',
        'position',
        )
    
    list_filter = ('status','priority',)
    search_fields = ('name','code')
    ordering = ('position',)