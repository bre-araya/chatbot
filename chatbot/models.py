from django.db import models
import uuid
from django.utils import timezone
from django.contrib.auth.hashers import make_password
from django.contrib.auth.hashers import check_password

def generate_ticket_id():
    return str(uuid.uuid4())[:8]

class ChatSession(models.Model):
    session_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'chat_sessions'
        ordering = ['-created_at']

    def __str__(self):
        return f"Session {str(self.session_id)[:8]}..."

class ChatMessage(models.Model):
    session_id = models.UUIDField()
    message = models.TextField()
    is_user = models.BooleanField(default=True)
    intent = models.CharField(max_length=100, blank=True)
    confidence = models.FloatField(default=0.0)
    email = models.EmailField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['intent']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        sender = "User" if self.is_user else "Bot"
        preview = self.message[:30] + '...' if len(self.message) > 30 else self.message
        return f"{sender}: {preview}"

class Ticket(models.Model):
    ticket_id = models.CharField(max_length=36, unique=True, default=generate_ticket_id, editable=False)
    session_id = models.UUIDField(null=True, blank=True)
    question = models.TextField()
    name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    STATUS_CHOICES = [
        ('open', 'Open'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
        ('closed', 'Closed'),
    ]
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='open')
    assignment = models.CharField(max_length=100, default='unassigned')
    created_at = models.DateTimeField(auto_now_add=True)
    answer = models.TextField(blank=True, null=True)

    class Meta:
        db_table = 'tickets'
        ordering = ['-created_at']

    def __str__(self):
        return f"Ticket {self.ticket_id} - {self.name}"

class FAQ(models.Model):
    question = models.TextField()
    answer = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'faqs'
        ordering = ['-created_at']

    def __str__(self):
        return f"FAQ: {self.question[:50]}..."

class Account(models.Model):
    name = models.CharField(max_length=35)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=12)
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('technical', 'Technical Admin'),
        ('support', 'Customer Service'),
        ('finance', 'Finance/Accounting'),
    ]
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='support')
    password = models.CharField(max_length=128)  # Will store hashed password
    reset_token = models.CharField(max_length=64, blank=True, null=True)  # Token for password reset
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'accounts'
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} - {self.email}"

    def set_password(self, raw_password):
        self.password = make_password(raw_password)

    def check_password(self, raw_password):
        return check_password(raw_password, self.password)
