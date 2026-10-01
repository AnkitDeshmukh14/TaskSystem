from django.contrib import admin
from .models import Comment

@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = (
        'task',
        'user',
        'content',
        'created_at',
    )
    ordering = ('-created_at',)