from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.contrib.auth.models import User

# 🔹 Login View (Set JWT in HTTP-only Cookie)
@api_view(["POST"])
def login_view(request):
    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        response = Response({"message": "Login successful", "username": username})
        response.set_cookie("access_token", access_token, httponly=True, samesite="Lax")
        response.set_cookie("refresh_token", str(refresh), httponly=True, samesite="Lax")
        return response
    else:
        return Response({"error": "Invalid credentials"}, status=400)

# 🔹 Logout View (Delete Cookies)
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def logout_view(request):
    response = Response({"message": "Logged out successfully"})
    response.delete_cookie("access_token")
    response.delete_cookie("refresh_token")
    return response

# 🔹 Check Authentication (Returns User Info)
@api_view(["GET"])
def check_authentication(request):
    token = request.COOKIES.get("access_token")
    if not token:
        return Response({"is_authenticated": False}, status=401)

    try:
        access_token = AccessToken(token)
        user_id = access_token["user_id"]
        
        # Fetch the user from the database using the user_id
        user = User.objects.get(id=user_id)
        
        # Return user details (customize the fields as needed)
        user_details = {
            "is_authenticated": True,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            # Add other user fields if necessary
        }
        return Response(user_details, status=200)
    except Exception:
        return Response({"is_authenticated": False}, status=401)

# 🔹 Refresh Token (Get New Access Token)
@api_view(["POST"])
def refresh_token_view(request):
    refresh_token = request.COOKIES.get("refresh_token")
    if not refresh_token:
        return Response({"error": "Refresh token missing"}, status=401)

    try:
        refresh = RefreshToken(refresh_token)
        access_token = str(refresh.access_token)

        response = Response({"message": "Token refreshed"})
        response.set_cookie("access_token", access_token, httponly=True, samesite="Lax")
        return response
    except Exception:
        return Response({"error": "Invalid refresh token"}, status=401)
