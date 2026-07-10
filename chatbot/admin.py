from django.contrib import admin
from django.utils.html import format_html
from .models import ChatSession, ChatMessage, Ticket

# -----------------------------
# ChatSession Admin
# -----------------------------
@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    """Admin interface for ChatSession model"""
    list_display = ['short_session_id', 'created_at', 'updated_at', 'message_count', 'latest_message']
    list_filter = ['created_at', 'updated_at']
    search_fields = ['session_id']
    readonly_fields = ['session_id', 'created_at', 'updated_at']
    ordering = ['-created_at']

    # Actions
    actions = ['export_chat_sessions', 'clear_old_sessions']

    # Shorten UUID for admin display
    def short_session_id(self, obj):
        return str(obj.session_id)[:8] + '...'
    short_session_id.short_description = 'Session ID'

    def message_count(self, obj):
        """Display count of messages in the session"""
        from .models import ChatMessage
        return ChatMessage.objects.filter(session_id=obj.session_id).count()
    message_count.short_description = 'Message Count'

    def latest_message(self, obj):
        """Display the latest message preview"""
        from .models import ChatMessage
        latest_msg = ChatMessage.objects.filter(session_id=obj.session_id).order_by('-created_at').first()
        if latest_msg:
            preview = latest_msg.message[:50] + '...' if len(latest_msg.message) > 50 else latest_msg.message
            return f"{'👤' if latest_msg.is_user else '🤖'} {preview}"
        return "No messages"
    latest_message.short_description = 'Latest Message'

    # Admin actions
    def export_chat_sessions(self, request, queryset):
        """Admin action to export selected chat sessions"""
        # Implement CSV/JSON export logic here
        pass
    export_chat_sessions.short_description = "Export selected chat sessions"

    def clear_old_sessions(self, request, queryset):
        """Admin action to clear old chat sessions"""
        # Implement deletion logic here
        pass
    clear_old_sessions.short_description = "Clear selected chat sessions"


# -----------------------------
# ChatMessage Admin
# -----------------------------
@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ['session_display', 'message_preview', 'is_user_icon', 'intent', 'confidence_display', 'created_at']
    list_filter = ['is_user', 'intent', 'created_at', 'session_id']
    search_fields = ['message', 'session_id', 'intent']
    readonly_fields = ['session_id', 'message', 'is_user', 'intent', 'confidence', 'created_at']
    list_per_page = 20
    ordering = ['-created_at']

    def session_display(self, obj):
        return str(obj.session_id)[:8] + '...'
    session_display.short_description = 'Session ID'

    def message_preview(self, obj):
        preview = obj.message[:60] + '...' if len(obj.message) > 60 else obj.message
        return preview
    message_preview.short_description = 'Message'

    def is_user_icon(self, obj):
        return '👤 User' if obj.is_user else '🤖 Bot'
    is_user_icon.short_description = 'Sender'

    def confidence_display(self, obj):
        return f"{obj.confidence:.1%}"
    confidence_display.short_description = 'Confidence'

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


# -----------------------------
# Ticket Admin
# -----------------------------
@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    list_display = ['ticket_id', 'name', 'email', 'status', 'created_at', 'session_display']
    list_filter = ['status', 'created_at', 'session_id']
    search_fields = ['ticket_id', 'name', 'email', 'question']
    readonly_fields = ['ticket_id', 'created_at']
    list_per_page = 20
    ordering = ['-created_at']

    def session_display(self, obj):
        return str(obj.session_id)[:8] + '...' if obj.session_id else 'None'
    session_display.short_description = 'Session ID'

    fieldsets = (
        ('Ticket Information', {
            'fields': ('ticket_id', 'name', 'email', 'phone', 'status')
        }),
        ('Issue Details', {
            'fields': ('question', 'session_id')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
    )


# -----------------------------
# Admin Site Customization
# -----------------------------
admin.site.site_header = "AI Helpdesk Chatbot Administration"
admin.site.site_title = "AI Helpdesk Chatbot Admin"
admin.site.index_title = "Welcome to AI Helpdesk Chatbot Administration"
