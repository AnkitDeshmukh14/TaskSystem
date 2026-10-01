from django.urls import path
from .views import *

urlpatterns = [
    path("me/", CurrentUserView.as_view(), name="current-user"),
    path("users/", UsersListView.as_view(), name="users-list"),

]