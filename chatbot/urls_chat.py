from django.urls import path
from . import views
from .views_dashboard import dashboard_stats

urlpatterns = [
    path('chat/ask/', views.chat_api, name='chat_api'),
    path('chat/messages', views.get_messages_by_email, name='get_messages_by_email'),
    path('tickets/create/', views.create_ticket, name='create_ticket'),
    path('tickets/', views.get_tickets_by_email, name='get_tickets_by_email'),
    path('tickets/all/', views.get_all_tickets, name='get_all_tickets'),
    path('tickets/<str:ticket_id>/', views.update_ticket_answer, name='update_ticket_answer'),
    path('tickets/<str:ticket_id>/assignment/', views.update_ticket_assignment, name='update_ticket_assignment'),
    path('tickets/<str:ticket_id>/delete/', views.delete_ticket, name='delete_ticket'),
    path('health/', views.health_check, name='health_check'),
    path('dashboard/stats/', dashboard_stats, name='dashboard_stats'),

    # FAQ endpoints
    path('faqs/', views.get_faqs, name='get_faqs'),
    path('faqs/create/', views.create_faq, name='create_faq'),
    path('faqs/<int:faq_id>/update/', views.update_faq, name='update_faq'),
    path('faqs/<int:faq_id>/delete/', views.delete_faq, name='delete_faq'),
]
