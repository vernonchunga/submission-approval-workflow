from django.db import models
from django.db import models
from django.conf import settings

class Application(models.Model):

    class Status(models.TextChoices):

        DRAFT = "DRAFT", "Draft"

        SUBMITTED = "SUBMITTED", "Submitted"

        UNDER_REVIEW = "UNDER_REVIEW", "Under Review"

        APPROVED = "APPROVED", "Approved"

        REJECTED = "REJECTED", "Rejected"

        RETURNED = "RETURNED", "Returned"

    class Category(models.TextChoices):

        FINANCE = "FINANCE", "Finance"

        HR = "HR", "Human Resource"

        PROCUREMENT = "PROCUREMENT", "Procurement"

        IT = "IT", "IT"

    title = models.CharField(max_length=200)

    category = models.CharField(
        max_length=30,
        choices=Category.choices
    )

    description = models.TextField()

    amount = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.DRAFT
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="applications"
    )

    submitted_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    updated_at = models.DateTimeField(auto_now=True)

    class Meta:

        ordering = ["-created_at"]

        indexes = [

            models.Index(fields=["status"]),

            models.Index(fields=["owner"]),

            models.Index(fields=["created_at"]),

        ]

    def __str__(self):
        return self.title
    
class AuditLog(models.Model):

    application = models.ForeignKey(
        Application,
        on_delete=models.CASCADE,
        related_name="audit_logs"
    )

    performed_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True
    )

    old_status = models.CharField(max_length=20)

    new_status = models.CharField(max_length=20)

    comment = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["created_at"]

    def __str__(self):
        return (
            f"{self.application.title}: "
            f"{self.old_status} → {self.new_status}"
        )
