import json
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from .models import ChatSession, ChatMessage, Ticket
import uuid


class ChatAPITestCase(APITestCase):
    def setUp(self):
        # Create test data
        self.session = ChatSession.objects.create()
        self.email = 'test@example.com'

        # Create some chat messages
        ChatMessage.objects.create(
            session_id=self.session.session_id,
            message='Hello',
            is_user=True,
            email=self.email
        )
        ChatMessage.objects.create(
            session_id=self.session.session_id,
            message='Hi there!',
            is_user=False,
            email=self.email
        )

    def test_get_messages_by_email_success(self):
        """Test successful retrieval of messages by email"""
        url = reverse('get_messages_by_email')
        response = self.client.get(url, {'userEmail': self.email})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(len(data['messages']), 2)
        self.assertEqual(data['messages'][0]['message'], 'Hello')
        self.assertEqual(data['messages'][1]['message'], 'Hi there!')

    def test_get_messages_by_email_no_email(self):
        """Test error when no email provided"""
        url = reverse('get_messages_by_email')
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        data = response.json()
        self.assertFalse(data['success'])
        self.assertIn('userEmail', data['error'])

    def test_get_messages_by_email_no_messages(self):
        """Test empty result when no messages for email"""
        url = reverse('get_messages_by_email')
        response = self.client.get(url, {'userEmail': 'nonexistent@example.com'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(len(data['messages']), 0)


class TicketAPITestCase(APITestCase):
    def setUp(self):
        self.session = ChatSession.objects.create()
        self.ticket_data = {
            'question': 'Test question',
            'name': 'Test User',
            'email': 'test@example.com',
            'phone': '1234567890',
            'session_id': str(self.session.session_id)
        }

    def test_create_ticket_success(self):
        """Test successful ticket creation"""
        url = reverse('create_ticket')
        response = self.client.post(url, self.ticket_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertIn('ticket', data)

        # Verify ticket was created in DB
        ticket = Ticket.objects.get(ticket_id=data['ticket']['ticket_id'])
        self.assertEqual(ticket.question, self.ticket_data['question'])
        self.assertEqual(str(ticket.session_id), self.ticket_data['session_id'])

    def test_get_tickets_by_email_success(self):
        """Test successful retrieval of tickets by email"""
        # First create a ticket
        ticket = Ticket.objects.create(
            session_id=self.session.session_id,
            question='Test question',
            name='Test User',
            email='test@example.com',
            phone='1234567890'
        )

        url = reverse('get_tickets_by_email')
        response = self.client.get(url, {'userEmail': 'test@example.com'})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        data = response.json()
        self.assertTrue(data['success'])
        self.assertEqual(len(data['tickets']), 1)
        self.assertEqual(data['tickets'][0]['question'], 'Test question')
