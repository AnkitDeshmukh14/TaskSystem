from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import Comment
from .serializers import CommentSerializer

class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        task_id = self.request.query_params.get('task')
        queryset = Comment.objects.all().order_by('created_at')
        if task_id:
            queryset = queryset.filter(task_id=task_id)
        return queryset

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)