import pytest
from Applications.services import ApplicationService
from Applications.models import Application
from rest_framework.test import APIClient
from .factories import (
    create_applicant,
    create_reviewer,
    create_application
)

@pytest.mark.django_db
def test_login():
    applicant = create_applicant()
    client = APIClient()
    response = client.post(
        "/api/auth/login/",
        {
            "username":"applicant",
            "password":"password123"
        }
    )

    assert response.status_code == 200
    assert "access" in response.data

@pytest.mark.django_db
def test_create_application():
    applicant = create_applicant()
    client = APIClient()
    client.force_authenticate(applicant)
    response = client.post(
        "/api/applications/",
        {
            "title":"Laptop",
            "category":"IT",
            "description":"Dell",
            "amount":"12000"
        }
    )

    assert response.status_code == 201

@pytest.mark.django_db
def test_submit_endpoint():
    applicant = create_applicant()
    application = create_application(applicant)
    client = APIClient()
    client.force_authenticate(applicant)
    response = client.post(
        f"/api/applications/{application.id}/submit/"
    )

    assert response.status_code == 200

@pytest.mark.django_db
def test_cannot_edit_after_submission():
    applicant = create_applicant()
    application = create_application(applicant)
    ApplicationService.transition(
        application,
        Application.Status.SUBMITTED,
        applicant
    )

    client = APIClient()
    client.force_authenticate(applicant)
    response = client.patch(
        f"/api/applications/{application.id}/",
        {
            "title":"New Title"
        }
    )

    assert response.status_code == 403