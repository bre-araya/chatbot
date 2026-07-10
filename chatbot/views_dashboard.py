from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.utils import timezone
from datetime import timedelta
from django.db.models import Count

from .models import ChatMessage, Ticket
from .serializers import DashboardStatsSerializer

@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    try:
        # Total Chats count from chat_message database
        total_chats = ChatMessage.objects.count()
        print(f"Total chats: {total_chats}")

        # Open Tickets count where status is 'open'
        open_tickets = Ticket.objects.filter(status='open').count()
        print(f"Open tickets: {open_tickets}")

        # New Users count - number of new email registered in last 7 days
        one_week_ago = timezone.now() - timedelta(days=7)
        new_users_query = ChatMessage.objects.filter(
            created_at__gte=one_week_ago,
            email__isnull=False
        ).values('email').distinct()
        new_users = new_users_query.count()
        print(f"New users query: {new_users_query}")
        print(f"New users: {new_users}")

        # Active Agents - number of agents chatting right now
        # Assuming agents are those who have sent messages in the last 5 minutes
        five_minutes_ago = timezone.now() - timedelta(minutes=5)
        active_agents_query = ChatMessage.objects.filter(
            created_at__gte=five_minutes_ago,
            email__isnull=False
        ).values('email').distinct()
        active_agents = active_agents_query.count()
        print(f"Active agents query: {active_agents_query}")
        print(f"Active agents: {active_agents}")

        return Response({
            'success': True,
            'total_chats': total_chats,
            'open_tickets': open_tickets,
            'new_users': new_users,
            'active_agents': active_agents
        }, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error in dashboard_stats: {str(e)}")
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
