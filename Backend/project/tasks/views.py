from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Task
from .serializers import TaskSerializer
from .permissions import IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from django.db import transaction

class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all().order_by('position')
    serializer_class = TaskSerializer

    def get_permissions(self):
        if self.req.method == 'POST':
            return [IsAdminUser()]
        return [IsAuthenticated()]

class TaskDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [IsAdminUser()]
        return [IsAuthenticated()]

class TaskStatusUpdateView(generics.UpdateAPIView):
    queryset = Task.objects.all()
    serializer_class = TaskSerializer
    permission_classes = [IsAuthenticated]

    def patch(self, req, *args, **kwargs):
        task = self.get_object()
        new_status = req.data.get('status')
        if not new_status:
            return Response({"error": "Status is required."},  status=status.HTTP_400_BAD_REQUEST )
        valid_statuses = [
            'Pending',
            'In Progress',
            'Completed'
        ]
        if new_status not in valid_statuses:
            return Response({"error": "Invalid status."},status=status.HTTP_400_BAD_REQUEST)
        task.status = new_status
        task.save()
        serializer = self.get_serializer(task)
        return Response(serializer.data)

class TaskListCreateView(generics.ListCreateAPIView):
    queryset = Task.objects.all().order_by('position')
    serializer_class = TaskSerializer
    filterset_fields = ['status', 'priority']
    search_fields = ['name', 'code']
    ordering_fields = ['due_date', 'priority', 'created_at', 'position']

    def get_permissions(self):
        if self.request.method == 'POST':
            return [IsAdminUser()]
        return [IsAuthenticated()]

class TaskReorderView(APIView):
    permission_classes = [IsAdminUser]
    def patch(self, req):
        task_ids = req.data.get('task_ids')
        if not isinstance(task_ids, list):
            return Response({"error": "task_ids must be a list."}, status=status.HTTP_400_BAD_REQUEST)

        if len(task_ids) != len(set(task_ids)):
            return Response( {"error": "Duplicate task IDs are not allowed."}, status=status.HTTP_400_BAD_REQUEST )
        
        tasks = Task.objects.filter(id__in=task_ids)
        if tasks.count() != len(task_ids):
            return Response({"error": "One or more task IDs are invalid."},status=status.HTTP_400_BAD_REQUEST)
        
        task_map = {task.id: task for task in tasks}
        with transaction.atomic():
            for position, task_id in enumerate(task_ids):
                task = task_map[task_id]
                task.position = position
                task.save(update_fields=['position'])
        return Response({"message": "Tasks reordered successfully."})

class TaskExportView(generics.ListAPIView):
    serializer_class = TaskSerializer
    permission_classes = [IsAdminUser]
    pagination_class = None

    filterset_fields = ['status', 'priority']
    search_fields = ['name', 'code']
    ordering_fields = ['due_date', 'priority', 'created_at', 'position']

    def get_queryset(self):
        return Task.objects.all().order_by('position')