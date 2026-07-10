from rest_framework import serializers
from .models import FAQ, Ticket, ChatMessage, ChatSession, Account
from rest_framework.validators import UniqueValidator

class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ['id', 'question', 'answer', 'created_at', 'updated_at']
        extra_kwargs = {'id': {'read_only': True}} # makes 'id' read-only (so frontend cannot modify it).

class TicketSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ticket
        fields = '__all__'

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'

class ChatRequestSerializer(serializers.Serializer):
    message = serializers.CharField(min_length=1)
    session_id = serializers.UUIDField(required=False)
    email = serializers.CharField(required=False)

class ChatResponseSerializer(serializers.Serializer):
    success = serializers.BooleanField()
    reply = serializers.CharField()
    intent = serializers.CharField()
    confidence = serializers.FloatField()
    session_id = serializers.UUIDField()
    status = serializers.CharField()

class DashboardStatsSerializer(serializers.Serializer):
    total_chats = serializers.IntegerField()
    open_tickets = serializers.IntegerField()
    new_users = serializers.IntegerField()
    active_agents = serializers.IntegerField()

class AccountCreateSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = Account
        fields = ('name', 'email', 'phone', 'role', 'password', 'confirm_password')
        extra_kwargs = {
            'password': {'write_only': True},
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('confirm_password')  # Remove confirm_password before saving
        account = Account(**validated_data)
        account.set_password(validated_data['password'])  # Hash the password
        account.save()
        return account
