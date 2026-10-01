from django.db import models

class Task(models.Model):
    Priority_choices = [
        ('Low', 'Low'),
        ('Medium', 'Medium'),
        ('High', 'High'),
    ]
    Status_choices = [
        ('Pending', 'Pending'),
        ('In Progress', 'In Progress'),
        ('Completed', 'Completed'),
    ]
    name = models.CharField(max_length=200)
    code = models.CharField(max_length=50,unique=True)
    description = models.TextField()
    due_date = models.DateField()
    priority = models.CharField(max_length=20,choices=Priority_choices,default='Medium')
    status = models.CharField(max_length=20,choices=Status_choices,default='Pending')
    position = models.PositiveIntegerField(default=0)
    attachment = models.ImageField(upload_to='tasks/',blank=True,null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return f"{self.code} - {self.name}"
