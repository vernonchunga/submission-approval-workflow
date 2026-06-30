from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from Applications.models import Application, AuditLog
from django.utils import timezone

User = get_user_model()

class Command(BaseCommand):
    help = "Seeds the database with sample users"
    def handle(self, *args, **options):
        # Applicant
        applicant, created = User.objects.get_or_create(
            username="applicant",
            defaults={
                "role": "APPLICANT",
                "email": "applicant@example.com",
            }
        )

        if created:
            applicant.set_password("password123")
            applicant.save()
            self.stdout.write(
                self.style.SUCCESS("✓ Applicant created")
            )
        else:
            self.stdout.write(
                self.style.WARNING("Applicant already exists")
            )

        # Reviewer
        reviewer, created = User.objects.get_or_create(
            username="reviewer",
            defaults={
                "role": "REVIEWER",
                "email": "reviewer@example.com",
            }
        )

        if created:
            reviewer.set_password("password123")
            reviewer.save()
            self.stdout.write(
                self.style.SUCCESS("✓ Reviewer created")
            )
        else:
            self.stdout.write(
                self.style.WARNING("Reviewer already exists")
            )

        self.stdout.write(
            self.style.SUCCESS("Database seeding complete.")
        )

        draft, created = Application.objects.get_or_create(
            owner=applicant,
            title="Purchase Development Laptop",
            defaults={
                "category": "IT Equipment",
                "description": "Dell Latitude 7450 for software development.",
                "amount": 25000,
                "status": Application.Status.DRAFT,
            },
        )

        if created:
            self.stdout.write(
                self.style.SUCCESS("✓ Draft application created")
            )

        submitted, created = Application.objects.get_or_create(
    owner=applicant,
    title="Office Furniture",
    defaults={
        "category": "Office Supplies",
        "description": "Ergonomic office chair.",
        "amount": 4500,
        "status": Application.Status.SUBMITTED,
        "submitted_at": timezone.now(),
    },
)

        if created:
            AuditLog.objects.create(
                application=submitted,
                performed_by=applicant,
                old_status=Application.Status.DRAFT,
                new_status=Application.Status.SUBMITTED,
                comment="Submitted for review.",
            )

            self.stdout.write(
                self.style.SUCCESS("✓ Submitted application created")
            )

        review, created = Application.objects.get_or_create(
    owner=applicant,
    title="Cloud Infrastructure",
    defaults={
        "category": "Cloud Services",
        "description": "AWS hosting for production deployment.",
        "amount": 18000,
        "status": Application.Status.UNDER_REVIEW,
        "submitted_at": timezone.now(),
    },
)

        if created:
            AuditLog.objects.create(
                application=review,
                performed_by=applicant,
                old_status=Application.Status.DRAFT,
                new_status=Application.Status.SUBMITTED,
                comment="Submitted for review.",
            )
            AuditLog.objects.create(
                application=review,
                performed_by=reviewer,
                old_status=Application.Status.SUBMITTED,
                new_status=Application.Status.UNDER_REVIEW,
                comment="Review started.",
            )
            self.stdout.write(
                self.style.SUCCESS("✓ Under Review application created")
            )

        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS("=" * 50)
        )
        self.stdout.write(
            self.style.SUCCESS("Database successfully seeded!")
        )
        self.stdout.write("")
        self.stdout.write("Applicant:")
        self.stdout.write("  Username: applicant")
        self.stdout.write("  Password: password123")
        self.stdout.write("")
        self.stdout.write("Reviewer:")
        self.stdout.write("  Username: reviewer")
        self.stdout.write("  Password: password123")
        self.stdout.write("")
        self.stdout.write(
            self.style.SUCCESS("=" * 50)
        )

        