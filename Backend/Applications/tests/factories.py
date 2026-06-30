from django.contrib.auth import get_user_model
from Applications.models import Application

User = get_user_model()

def create_applicant():
    return User.objects.create_user(
        username="applicant",
        password="password123",
        role="APPLICANT"
    )

def create_reviewer():
    return User.objects.create_user(
        username="reviewer",
        password="password123",
        role="REVIEWER"
    )

def create_application(owner):
    return Application.objects.create(
        owner=owner,
        title="Laptop",
        category="IT",
        description="Dell",
        amount=12000
    )