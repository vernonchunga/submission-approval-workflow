from django.shortcuts import render
from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.exceptions import PermissionDenied
from .models import Application
from .serializers import ApplicationSerializer, TransitionSerializer, AuditSerializer
from .services import ApplicationService

class ApplicationViewSet(viewsets.ModelViewSet):
    serializer_class = ApplicationSerializer

    def get_queryset(self):
        queryset = (
            Application.objects
            .select_related("owner")
        )

        if self.request.user.role == "REVIEWER":
            return queryset
        return queryset.filter(owner=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(
            owner=self.request.user
        )

    def perform_update(self, serializer):
        application = self.get_object()

        # Only the owner can edit
        if application.owner != self.request.user:
            raise PermissionDenied(
                "You do not own this application."
            )

        # Can only edit drafts
        if application.status != Application.Status.DRAFT:
            raise PermissionDenied(
                "Only draft applications can be edited."
            )

        serializer.save()

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            raise PermissionDenied(
                "You do not own this application."
            )

        if instance.status != Application.Status.DRAFT:
            raise PermissionDenied(
                "Only draft applications can be deleted."
            )

        instance.delete()

    def retrieve(self, request, *args, **kwargs):
        application = self.get_object()
        if (
            request.user.role == "REVIEWER"
            and application.status == Application.Status.SUBMITTED
        ):
            ApplicationService.transition(
                application,
                Application.Status.UNDER_REVIEW,
                request.user
            )

        return super().retrieve(request, *args, **kwargs)
    
    
    def _transition(
        self,
        request,
        new_status,
        requires_comment=False
    ):
        """
        Reusable helper for all workflow transitions.
        """

        application = self.get_object()

        comment = ""

        if requires_comment:
            serializer = TransitionSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            comment = serializer.validated_data.get("comment", "")

        ApplicationService.transition(
            application=application,
            new_status=new_status,
            user=request.user,
            comment=comment,
        )

        return Response(
            {"message": f"Application {new_status.replace('_', ' ').lower()} successfully."},
            status=status.HTTP_200_OK
        )
    

    @action(detail=True, methods=["post"])
    def submit(self, request, pk=None):

        return self._transition(
            request,
            Application.Status.SUBMITTED,
        )
    
    @action(detail=True, methods=["post"], url_path="start-review")
    def start_review(self, request, pk=None):

        return self._transition(
            request,
            Application.Status.UNDER_REVIEW,
        )
    
    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):

        return self._transition(
            request,
            Application.Status.APPROVED,
        )
    
    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):

        return self._transition(
            request,
            Application.Status.REJECTED,
            requires_comment=True
        )
    
    @action(detail=True, methods=["post"], url_path="return")
    def return_application(self, request, pk=None):

        return self._transition(
            request,
            Application.Status.RETURNED,
            requires_comment=True
        )

    @action(detail=True, methods=["get"])
    def history(self, request, pk=None):
        application = self.get_object()
        serializer = AuditSerializer(
            application.audit_logs.all(),
            many=True
        )

        return Response(serializer.data)
    
    @action(detail=False, methods=["get"], url_path="review-queue")
    def review_queue(self, request):
        """
        Returns applications awaiting reviewer action.
        """
        if request.user.role != "REVIEWER":
            raise PermissionDenied(
                "Only reviewers can access the review queue."
            )
        queryset = (
            Application.objects
            .select_related("owner")
            .filter(
                status__in=[
                    Application.Status.SUBMITTED,
                    Application.Status.UNDER_REVIEW,
                ]
            )
            .order_by("submitted_at")
        )
        serializer = self.get_serializer(queryset, many=True)

        return Response(serializer.data)
    
    @action(detail=False, methods=["get"])
    def dashboard(self, request):
        if request.user.role == "APPLICANT":
            queryset = (
                Application.objects
                .filter(owner=request.user)
            )

        else:
            queryset = Application.objects.all()
        summary = (
            queryset
            .values("status")
            .annotate(total=Count("id"))
        )

        return Response(summary)

    