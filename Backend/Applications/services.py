from django.utils import timezone
from django.db import transaction
from .models import Application, AuditLog


# ==========================================================
# STATE MACHINE
# ==========================================================

ALLOWED_TRANSITIONS = {

    Application.Status.DRAFT: [
        Application.Status.SUBMITTED
    ],

    Application.Status.SUBMITTED: [
        Application.Status.UNDER_REVIEW
    ],

    Application.Status.UNDER_REVIEW: [
        Application.Status.APPROVED,
        Application.Status.REJECTED,
        Application.Status.RETURNED,
    ],

    Application.Status.RETURNED: [
        Application.Status.SUBMITTED
    ],

    Application.Status.APPROVED: [],

    Application.Status.REJECTED: [],
}


# ==========================================================
# APPLICATION SERVICE
# ==========================================================

class ApplicationService:

    @staticmethod
    def transition(
        application,
        new_status,
        user,
        comment=""
    ):
        """
        Handles all application status transitions.
        """

        # -------------------------------
        # Remember current status
        # -------------------------------

        old_status = application.status

        # -------------------------------
        # Authorization checks
        # -------------------------------

        ApplicationService._validate_permissions(
            application,
            user,
            new_status
        )

        # -------------------------------
        # Validate transition
        # -------------------------------

        ApplicationService._validate_transition(
            old_status,
            new_status
        )

        # -------------------------------
        # Comment validation
        # -------------------------------

        ApplicationService._validate_comment(
            new_status,
            comment
        )

        # -------------------------------
        # Update application
        # -------------------------------
        with transaction.atomic():

            application.status = new_status

            if new_status == Application.Status.SUBMITTED:
                application.submitted_at = timezone.now()

            application.save(
                update_fields=[
                    "status",
                    "submitted_at"
                ]
            )

            # -------------------------------
            # Create audit log
            # -------------------------------

            ApplicationService._create_audit_log(
            application,
            user,
            old_status,
            new_status,
            comment
        )
            
        return application
    
    @staticmethod
    def _validate_transition(old_status, new_status):

        allowed = ALLOWED_TRANSITIONS.get(old_status, [])

        if new_status not in allowed:
            raise ValueError(
                f"Cannot move from {old_status} to {new_status}"
            )
        
    @staticmethod
    def _validate_permissions(application, user, new_status):

        if user.role == "APPLICANT":

            if new_status in (
                Application.Status.APPROVED,
                Application.Status.REJECTED,
                Application.Status.RETURNED,
                Application.Status.UNDER_REVIEW,
            ):
                raise PermissionError(
                    "Applicants cannot perform reviewer actions."
                )

        elif user.role == "REVIEWER":

            if new_status in (
                Application.Status.SUBMITTED,
            ):
                raise PermissionError(
                    "Reviewers cannot submit applications."
                )
            
        if (
            new_status == Application.Status.SUBMITTED
            and application.owner != user
        ):
            raise PermissionError(
                "You can only submit your own applications."
            )
        
    @staticmethod
    def _validate_comment(new_status, comment):

        if (
            new_status in [
                Application.Status.REJECTED,
                Application.Status.RETURNED
            ]
            and not comment
        ):
            raise ValueError(
                "Comment is required."
            )
        
    @staticmethod
    def _create_audit_log(
        application,
        user,
        old_status,
        new_status,
        comment
    ):

        AuditLog.objects.create(
            application=application,
            performed_by=user,
            old_status=old_status,
            new_status=new_status,
            comment=comment,
        )
        
    