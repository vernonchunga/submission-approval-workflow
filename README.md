# Submission & Approval Workflow

A full-stack web application implementing a submission and approval workflow with role-based access control, workflow state management, audit logging, and JWT authentication.

This project was developed as part of the Full-Stack Developer Technical Assessment (Assignment B).

---

# Live Demo

Frontend:
https://submission-approval-workflow-git-main-vernon1.vercel.app

Backend API:
https://submission-approval-workflow-1.onrender.com

Swagger Documentation:
https://submission-approval-workflow-1.onrender.com/api/docs/

---

## Test Credentials

Applicant

Username: applicant
Password: applicant123

Reviewer

Username: reviewer
Password: reviewer123

---

# Technology Stack

## Backend

- Python 3
- Django
- Django REST Framework
- Simple JWT Authentication
- SQLite
- Pytest
- DRF Spectacular (Swagger)

## Frontend

- React
- TypeScript
- Vite
- Material UI
- Axios
- React Router

## Deployment

- Backend: Render
- Frontend: Vercel

---

# Features

## Applicant

- Login using JWT authentication
- Create draft applications
- Edit draft applications
- Delete draft applications
- Submit applications
- View application history
- View application status

## Reviewer

- Login
- Review submitted applications
- Approve applications
- Reject applications with comments
- Return applications for changes
- View audit history

---

# Workflow

Applications follow the workflow below:

```
DRAFT
   │
   ▼
SUBMITTED
   │
   ▼
UNDER_REVIEW
   ├───────────────┐
   ▼               ▼
APPROVED      REJECTED

        or

RETURNED
   │
   ▼
SUBMITTED
```

Illegal state transitions are rejected by the backend.

---

# Authorization Rules

Applicants

- Can create applications
- Can edit drafts only
- Cannot approve applications
- Cannot reject applications
- Cannot return applications

Reviewers

- Can review submitted applications
- Can approve applications
- Can reject applications
- Can return applications
- Cannot create applications

All authorization is enforced server-side.

---

# Audit Trail

Every workflow transition creates an audit log containing:

- User
- Previous Status
- New Status
- Comment
- Timestamp

The frontend displays this history for every application.

---

# Data Model

## Application

- id
- owner
- title
- category
- description
- amount
- status
- submitted_at
- created_at
- updated_at

## AuditLog

- application
- performed_by
- old_status
- new_status
- comment
- timestamp

---

# API Endpoints

Authentication

```
POST /api/auth/login/
POST /api/auth/refresh/
```

Applications

```
GET    /api/applications/
POST   /api/applications/
PATCH  /api/applications/{id}/
DELETE /api/applications/{id}/
```

Workflow

```
POST /api/applications/{id}/submit/
POST /api/applications/{id}/approve/
POST /api/applications/{id}/reject/
POST /api/applications/{id}/return/
```

Other

```
GET /api/applications/review-queue/
GET /api/applications/dashboard/
GET /api/applications/{id}/history/
```

---

# Running Locally

## Backend

```bash
cd Backend

pipenv install

pipenv shell

python manage.py migrate

python manage.py runserver
```

Backend runs on:

```
http://127.0.0.1:8000
```

---

## Frontend

```bash
cd Frontend

npm install

npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

# Running Tests

```bash
pytest
```

Tests include:

- State machine transition rules
- Invalid workflow transitions
- Authorization checks
- API authorization

---

# Design Decisions

## Service Layer

Workflow logic is isolated inside an ApplicationService instead of placing business logic directly inside Django views.

Benefits:

- Easier testing
- Cleaner ViewSets
- Centralized business rules

---

## State Machine

The workflow is controlled through a transition map rather than multiple nested if statements.

This makes workflow changes simple while preventing illegal transitions.

---

## JWT Authentication

Authentication uses JSON Web Tokens.

Advantages:

- Stateless authentication
- Suitable for REST APIs
- Easy frontend integration

---

## Audit Logging

Every transition creates an immutable audit record.

This provides complete workflow traceability.

---

# Trade-offs

Due to the assessment time constraints, the focus was placed on implementing a robust backend workflow and a complete end-to-end application.

The following improvements would be made with additional time:

- PostgreSQL instead of SQLite
- Docker Compose configuration
- Automatic seed users during deployment
- Pagination
- Search and filtering in the review queue
- Better dashboard analytics
- File attachments
- Email notifications
- Refresh token rotation
- Improved UI polish
- Production environment configuration

---

# Deployment Notes

The application is deployed using:

Frontend:
Vercel

Backend:
Render

SQLite is currently used for persistence. On the Render free tier, the database is recreated on fresh deployments because the filesystem is ephemeral.

---

# AI Usage

The following AI tools were used during development:

- ChatGPT (OpenAI)

AI assisted with:

- Project planning
- Architecture discussions
- Code review
- Refactoring
- Debugging
- Test generation
- Documentation
- Deployment guidance

All generated code was reviewed, integrated, tested, and modified as required before submission.

---

# Future Improvements

- PostgreSQL
- Docker Compose
- CI/CD
- Automated deployment
- Better reviewer dashboard
- Advanced filtering
- Email notifications
- File uploads
- Search
- Pagination
- Role management
- Production-grade logging

---

# Author

Vernon Chunga

Full Stack Developer