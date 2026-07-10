# helpdesk_backend/views.py
from rest_framework.decorators import api_view
from rest_framework.response import Response

# Your existing chat API view
from chatbot.views import chat_api  # Import from your chatbot app

@api_view(['GET'])
def health_check(request):
    """
    Simple health check endpoint
    """
    return Response({"status": "ok"})
