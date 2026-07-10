from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("chatbot.urls_chat")),  # Chatbot endpoints
    path("api/", include("chatbot.urls_auth")),  # Auth endpoints

]
