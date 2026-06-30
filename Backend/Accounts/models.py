from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):

    class Roles(models.TextChoices):
        APPLICANT = "APPLICANT", "Applicant"
        REVIEWER = "REVIEWER", "Reviewer"

    role = models.CharField(
        max_length=20,
        choices=Roles.choices,
        default=Roles.APPLICANT
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.username
