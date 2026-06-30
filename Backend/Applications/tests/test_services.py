import pytest
from Applications.services import ApplicationService
from Applications.models import Application
from .factories import (
    create_applicant,
    create_reviewer,
    create_application
)

@pytest.mark.django_db
def test_submit_application():
    applicant = create_applicant()
    application = create_application(applicant)
    ApplicationService.transition(
        application,
        Application.Status.SUBMITTED,
        applicant
    )
    application.refresh_from_db()

    assert application.status == Application.Status.SUBMITTED

@pytest.mark.django_db
def test_invalid_transition():
    applicant = create_applicant()
    reviewer = create_reviewer()
    application = create_application(applicant)
    ApplicationService.transition(
        application,
        Application.Status.SUBMITTED,
        applicant
    )

    with pytest.raises(ValueError):
        ApplicationService.transition(
            application,
            Application.Status.APPROVED,
            reviewer
        )

@pytest.mark.django_db
def test_applicant_cannot_approve():
    applicant = create_applicant()
    application = create_application(applicant)
    ApplicationService.transition(
        application,
        Application.Status.SUBMITTED,
        applicant
    )

    reviewer = create_reviewer()
    ApplicationService.transition(
        application,
        Application.Status.UNDER_REVIEW,
        reviewer
    )

    with pytest.raises(PermissionError):
        ApplicationService.transition(
            application,
            Application.Status.APPROVED,
            applicant
        )

@pytest.mark.django_db
def test_reject_requires_comment():
    applicant = create_applicant()
    reviewer = create_reviewer()
    application = create_application(applicant)
    ApplicationService.transition(
        application,
        Application.Status.SUBMITTED,
        applicant
    )

    with pytest.raises(ValueError):
        ApplicationService.transition(
            application,
            Application.Status.REJECTED,
            reviewer
        )

@pytest.mark.django_db
def test_audit_created():
    applicant = create_applicant()
    application = create_application(applicant)
    ApplicationService.transition(
        application,
        Application.Status.SUBMITTED,
        applicant
    )

    assert application.audit_logs.count() == 1