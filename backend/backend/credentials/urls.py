from django.urls import path
from credentials.views import login_view, logout_view, check_authentication, refresh_token_view

urlpatterns = [
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("check-auth/", check_authentication, name="check_auth"),
    path("refresh-token/", refresh_token_view, name="refresh_token"),
]
