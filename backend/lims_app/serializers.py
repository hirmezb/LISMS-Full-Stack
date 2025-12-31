"""
Serializers for the LIMS backend API.

These serializers expose all model fields by default to simplify the API
implementation.  In a production system you might customise the fields list or
add nested serializers where appropriate.
"""

from rest_framework import serializers

from . import models


class UserAccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserAccount
        fields = "__all__"


class AnalystSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Analyst
        fields = "__all__"


class AdministratorSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Administrator
        fields = "__all__"


class SOPSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SOP
        fields = "__all__"


class UserSOPActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserSOPAction
        fields = "__all__"


class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Client
        fields = "__all__"


class WarehouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Warehouse
        fields = "__all__"


class WarehouseClientLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.WarehouseClientLink
        fields = "__all__"


class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Location
        fields = "__all__"


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Equipment
        fields = "__all__"


class MaintenanceLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.MaintenanceLog
        fields = "__all__"


class SampleSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Sample
        fields = "__all__"


class InProcessSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.InProcess
        fields = "__all__"


class StabilitySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Stability
        fields = "__all__"


class FinishedProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.FinishedProduct
        fields = "__all__"


class UserSampleActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserSampleAction
        fields = "__all__"


class TestSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Test
        fields = "__all__"


class SampleTestLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.SampleTestLink
        fields = "__all__"


class TestEquipmentLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TestEquipmentLink
        fields = "__all__"


class ReagentSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Reagent
        fields = "__all__"


class UserReagentActionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserReagentAction
        fields = "__all__"


class TestReagentLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.TestReagentLink
        fields = "__all__"


class VersionChangeSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.VersionChange
        fields = "__all__"
