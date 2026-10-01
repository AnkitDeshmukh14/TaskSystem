from django.urls import path
from .views import *


urlpatterns = [
    path('', TaskListCreateView.as_view(), name='task-list-create'),
    path('export/', TaskExportView.as_view(), name='task-export'),
    path( 'reorder/',TaskReorderView.as_view(), name='task-reorder'),
    path('<int:pk>/', TaskDetailView.as_view(), name='task-detail'),
    path('<int:pk>/status/',TaskStatusUpdateView.as_view(),name='task-status-update'),
]