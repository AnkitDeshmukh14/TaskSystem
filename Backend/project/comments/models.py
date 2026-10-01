from django.db import models
from django.contrib.auth.models import User
from tasks.models import Task

class Comment(models.Model):
    task = models.ForeignKey(Task, on_delete=models.CASCADE,related_name='comments')
    user = models.ForeignKey(User,on_delete=models.CASCADE)
    parent = models.ForeignKey('self',on_delete=models.CASCADE,null=True,blank=True,related_name='replies')
    content = models.TextField()
    attachment = models.FileField(upload_to='comments/',null=True,blank=True)
    created_at = models.DateTimeField( auto_now_add=True)

    def __str__(self):
        return f"{self.user.username}: {self.content[:30]}"