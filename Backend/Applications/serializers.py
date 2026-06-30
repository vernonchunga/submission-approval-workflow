from rest_framework import serializers
from .models import Application, AuditLog

class ApplicationSerializer(serializers.ModelSerializer):
    owner = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = Application
        fields = [
            "id",
            "title",
            "category",
            "description",
            "amount",
            "status",
            "owner",
            "submitted_at",
            "created_at",
            "updated_at",
        ]

        read_only_fields = [
            "status",
            "owner",
            "submitted_at",
            "created_at",
            "updated_at",
        ]

class TransitionSerializer(serializers.Serializer):
    comment = serializers.CharField(
        required=False,
        allow_blank=True
    )

class AuditSerializer(serializers.ModelSerializer):
    performed_by = serializers.StringRelatedField()
    class Meta:
        model = AuditLog
        fields = "__all__"