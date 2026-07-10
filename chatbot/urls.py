from django.urls import path
from .views import get_response, AskView, FeedbackView

urlpatterns = [
    # Function-based view (public)
    path("get-response/", get_response, name="get_response"),
    
    # DRF class-based views (authenticated)
    path("ask/", AskView.as_view(), name="ask"),
    path("feedback/", FeedbackView.as_view(), name="feedback"),
]
