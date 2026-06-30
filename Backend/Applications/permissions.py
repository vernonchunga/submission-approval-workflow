from rest_framework.permissions import BasePermission

class IsApplicant(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "APPLICANT"

class IsReviewer(BasePermission):
    def has_permission(self, request, view):
        return request.user.role == "REVIEWER"