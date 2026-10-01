from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User



class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, req):
        return Response({
            "id": req.user.id,
            "username": req.user.username,
            "is_staff": req.user.is_staff,
        })

class UsersListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        users = User.objects.all().values(
            "id",
            "username"
        )

        return Response(list(users))