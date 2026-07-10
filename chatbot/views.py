from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
import logging
import uuid
from django.utils.crypto import get_random_string

from .ai_service import AIService
from .serializers import ChatRequestSerializer, ChatResponseSerializer, TicketSerializer, ChatMessageSerializer, FAQSerializer, AccountCreateSerializer
from .models import ChatSession, ChatMessage, Ticket, FAQ, Account

logger = logging.getLogger(__name__)

@api_view(['POST'])
@permission_classes([AllowAny])
def chat_api(request):

    # Main chatbot API endpoint

    try:
        # Validate input
        serializer = ChatRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {
                    'success': False,
                    'error': 'Invalid input',
                    'details': serializer.errors
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        user_message = serializer.validated_data['message']
        session_id = serializer.validated_data.get('session_id')
        user_email = serializer.validated_data.get('email')

        # Get AI response with default settings
        ai_service = AIService.get_instance()
        ai_service.confidence_threshold = 0.6  # confidence threshold
        ai_response = ai_service.get_chat_response(user_message)

        # Create or get session
        session = None
        if session_id:
            try:
                session = ChatSession.objects.get(session_id=session_id)
            except ChatSession.DoesNotExist:
                session = None

        if not session:
            session_uuid = uuid.uuid4()
            session = ChatSession.objects.create(session_id=session_uuid)
            session_id = session_uuid

        # Save conversation to database
        try:
            # Save user message
            ChatMessage.objects.create(
                session_id=session_id,
                message=user_message,
                is_user=True,
                intent=ai_response.get('intent', 'unknown'),
                confidence=ai_response.get('confidence', 0.0),
                email=user_email
            )

            # Save bot response
            ChatMessage.objects.create(
                session_id=session_id,
                message=ai_response['response'],
                is_user=False,
                intent=ai_response.get('intent', 'unknown'),
                confidence=ai_response.get('confidence', 0.0),
                email=None
            )
        except Exception as db_error:
            logger.warning(f"Failed to save chat to database: {db_error}")

        # If escalation response, do not return immediately, wait for ticket creation
        if ai_response.get('status') == 'escalation':
            return Response({
                'success': True,
                'reply': ai_response['response'],
                'intent': ai_response['intent'],
                'confidence': ai_response['confidence'],
                'session_id': session_id,
                'status': ai_response['status'],
                'create_ticket': True
            }, status=status.HTTP_200_OK)

        # Prepare response
        response_data = {
            'success': True,
            'reply': ai_response['response'],
            'intent': ai_response['intent'],
            'confidence': ai_response['confidence'],
            'session_id': session_id,
            'status': ai_response['status']
        }

        return Response(response_data, status=status.HTTP_200_OK)

    except Exception as e:
        logger.error(f"Chat API error: {str(e)}", exc_info=True)
        return Response(
            {
                'success': False,
                'error': 'Internal server error',
                'message': 'Sorry, I encountered an error. Please try again.'
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def create_ticket(request):
    
    # Create a new ticket

    try:
        print(f"Request data: {request.data}")
        serializer = TicketSerializer(data=request.data)
        print(f"Serializer is_valid: {serializer.is_valid()}")
        if not serializer.is_valid():
            print(f"Serializer errors: {serializer.errors}")
        if serializer.is_valid():
            ticket = serializer.save()
            return Response({
                'success': True,
                'ticket_id': ticket.ticket_id,
                'message': 'Ticket created successfully'
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'error': 'Invalid data',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Create ticket error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_tickets_by_email(request):
    """
    Get all tickets for a specific email
    """
    try:
        email = request.GET.get('email')
        if not email:
            return Response({
                'success': False,
                'error': 'Email parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        tickets = Ticket.objects.filter(email=email).order_by('-created_at')
        serializer = TicketSerializer(tickets, many=True)
        return Response({
            'success': True,
            'tickets': serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Get tickets by email error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_messages_by_email(request):
    """
    Get all messages for a specific email (user messages and corresponding bot responses)
    """
    try:
        email = request.GET.get('userEmail')
        logger.info(f"get_messages_by_email called with userEmail: {email}")
        if not email:
            logger.warning("userEmail parameter is missing")
            return Response({
                'success': False,
                'error': 'userEmail parameter is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Get all session_ids that have messages with the given email
        session_ids = ChatMessage.objects.filter(email=email).values_list('session_id', flat=True).distinct()
        logger.info(f"Found {len(session_ids)} unique session_ids with email {email}")

        # Get all messages from those sessions, ordered by creation time
        messages = ChatMessage.objects.filter(
            session_id__in=session_ids
        ).order_by('created_at')
        logger.info(f"Found {messages.count()} messages in those sessions")

        serializer = ChatMessageSerializer(messages, many=True)
        logger.info("Serialization successful")
        return Response({
            'success': True,
            'messages': serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Get messages by email error: {str(e)}", exc_info=True)
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def health_check(request):
    """Health check endpoint for AI services"""
    try:
        ai_service = AIService.get_instance()
        status_info = ai_service.get_service_status()

        return Response({
            'success': True,
            'status': 'healthy' if status_info['models_loaded'] else 'degraded',
            'models_loaded': status_info['models_loaded'],
            'intent_labels': status_info['intent_labels'],
            'qa_answers_count': status_info['qa_answers_count'],
            'confidence_threshold': status_info['confidence_threshold']
        })

    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return Response({
            'success': False,
            'status': 'unhealthy',
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_tickets(request):
    """
    Get all tickets and set status to resolved if answer is not empty
    Filter by role if provided
    """
    try:
        role = request.GET.get('role')
        tickets = Ticket.objects.all()

        # Filter by assignment based on role
        if role == 'technical':
            tickets = tickets.filter(assignment__in=['technical', ])
        elif role == 'support':
            tickets = tickets.filter(assignment__in=['support', ])
        elif role == 'finance':
            tickets = tickets.filter(assignment__in=['finance', ])
        # For admin or no role, show all

        # Update status to resolved if answer is not empty
        for ticket in tickets:
            if ticket.answer and ticket.answer.strip() != '' and ticket.status != 'resolved':
                ticket.status = 'resolved'
                ticket.save()
        tickets = tickets.order_by('-created_at')
        serializer = TicketSerializer(tickets, many=True)
        return Response({
            'success': True,
            'tickets': serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Get all tickets error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
@permission_classes([AllowAny])
def update_ticket_answer(request, ticket_id):
    """
    Update a ticket's answer and set status to resolved if answer is provided
    """
    try:
        ticket = Ticket.objects.get(ticket_id=ticket_id)
        answer = request.data.get('answer', '')

        if answer.strip():
            ticket.answer = answer.strip()
            ticket.status = 'resolved'
            ticket.save()

        serializer = TicketSerializer(ticket)
        return Response({
            'success': True,
            'ticket': serializer.data
        }, status=status.HTTP_200_OK)
    except Ticket.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Ticket not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Update ticket answer error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PATCH'])
@permission_classes([AllowAny])
def update_ticket_assignment(request, ticket_id):
    """
    Update a ticket's assignment
    """
    try:
        ticket = Ticket.objects.get(ticket_id=ticket_id)
        assignment = request.data.get('assignment', '')

        if assignment:
            ticket.assignment = assignment
            ticket.save()

        serializer = TicketSerializer(ticket)
        return Response({
            'success': True,
            'ticket': serializer.data
        }, status=status.HTTP_200_OK)
    except Ticket.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Ticket not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Update ticket assignment error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_ticket(request, ticket_id):
    """
    Delete a ticket
    """
    try:
        ticket = Ticket.objects.get(ticket_id=ticket_id)
        ticket.delete()
        return Response({
            'success': True,
            'message': 'Ticket deleted successfully'
        }, status=status.HTTP_200_OK)
    except Ticket.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Ticket not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Delete ticket error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_faqs(request):
    """
    Get all FAQs
    """
    try:
        faqs = FAQ.objects.all().order_by('-created_at')
        serializer = FAQSerializer(faqs, many=True)
        return Response({
            'success': True,
            'faqs': serializer.data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Get FAQs error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_faq(request):
    """
    Create a new FAQ
    """
    try:
        serializer = FAQSerializer(data=request.data)
        if serializer.is_valid():
            faq = serializer.save()
            return Response({
                'success': True,
                'faq': serializer.data,
                'message': 'FAQ created successfully'
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'error': 'Invalid data',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Create FAQ error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['PUT'])
@permission_classes([AllowAny])
def update_faq(request, faq_id):
    """
    Update an existing FAQ
    """
    try:
        faq = FAQ.objects.get(id=faq_id)
        serializer = FAQSerializer(faq, data=request.data, partial=True)
        if serializer.is_valid():
            faq = serializer.save()
            return Response({
                'success': True,
                'faq': serializer.data,
                'message': 'FAQ updated successfully'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'error': 'Invalid data',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    except FAQ.DoesNotExist:
        return Response({
            'success': False,
            'error': 'FAQ not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Update FAQ error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_faq(request, faq_id):
    """
    Delete an FAQ
    """
    try:
        faq = FAQ.objects.get(id=faq_id)
        faq.delete()
        return Response({
            'success': True,
            'message': 'FAQ deleted successfully'
        }, status=status.HTTP_200_OK)
    except FAQ.DoesNotExist:
        return Response({
            'success': False,
            'error': 'FAQ not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Delete FAQ error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def create_account(request):
    """
    Create a new user account
    """
    try:
        serializer = AccountCreateSerializer(data=request.data)
        if serializer.is_valid():
            account = serializer.save()
            return Response({
                'success': True,
                'account': {
                    'id': account.id,
                    'name': account.name,
                    'email': account.email,
                    'phone': account.phone,
                    'role': account.role
                },
                'message': 'Account created successfully'
            }, status=status.HTTP_201_CREATED)
        else:
            return Response({
                'success': False,
                'error': 'Invalid data',
                'details': serializer.errors
            }, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        logger.error(f"Create account error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    """
    Login user with email and password
    """
    try:
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({
                'success': False,
                'error': 'Email and password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            account = Account.objects.get(email=email)
        except Account.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

        if account.check_password(password):
            return Response({
                'success': True,
                'user': {
                    'id': account.id,
                    'name': account.name,
                    'email': account.email,
                    'role': account.role
                },
                'message': 'Login successful'
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                'success': False,
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
    except Exception as e:
        logger.error(f"Login error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_all_accounts(request):
    """
    Get all user accounts
    """
    try:
        accounts = Account.objects.all()
        accounts_data = []
        for account in accounts:
            accounts_data.append({
                'id': account.id,
                'name': account.name,
                'email': account.email,
                'phone': account.phone,
                'role': account.role,
            })
        return Response({
            'success': True,
            'accounts': accounts_data
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Get all accounts error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    """
    Initiate password reset by verifying name, email, phone and generating a reset token
    """
    try:
        name = request.data.get('name')
        email = request.data.get('email')
        phone = request.data.get('phone')

        if not name or not email or not phone:
            return Response({
                'success': False,
                'error': 'Name, email, and phone are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            account = Account.objects.get(name=name, email=email, phone=phone)
        except Account.DoesNotExist:
            return Response({
                'success': False,
                'error': 'No account found with the provided details'
            }, status=status.HTTP_404_NOT_FOUND)

        # Generate a reset token
        reset_token = get_random_string(length=32)
        account.reset_token = reset_token
        account.save()

        return Response({
            'success': True,
            'reset_token': reset_token,
            'message': 'Verification successful. Please enter your new password.'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Forgot password error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
@permission_classes([AllowAny])
def reset_password(request):
    """
    Reset password using the reset token and new password
    """
    try:
        reset_token = request.data.get('reset_token')
        new_password = request.data.get('new_password')

        if not reset_token or not new_password:
            return Response({
                'success': False,
                'error': 'Reset token and new password are required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            account = Account.objects.get(reset_token=reset_token)
        except Account.DoesNotExist:
            return Response({
                'success': False,
                'error': 'Invalid reset token'
            }, status=status.HTTP_400_BAD_REQUEST)

        account.set_password(new_password)
        account.reset_token = None  # Clear the token
        account.save()

        return Response({
            'success': True,
            'message': 'Password reset successful. You can now login with your new password.'
        }, status=status.HTTP_200_OK)
    except Exception as e:
        logger.error(f"Reset password error: {str(e)}")
        return Response({
            'success': False,
            'error': 'Internal server error'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
