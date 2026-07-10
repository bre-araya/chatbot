from django.urls import path
from . import views

urlpatterns = [
    path('accounts/create/', views.create_account, name='create_account'),
    path('accounts/login/', views.login, name='login'),
    path('accounts/', views.get_all_accounts, name='get_all_accounts'),
    path('accounts/forgot_password/', views.forgot_password, name='forgot_password'),
    path('accounts/reset_password/', views.reset_password, name='reset_password'),
]
