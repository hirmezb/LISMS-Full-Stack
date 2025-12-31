"""
Viewsets for the LIMS backend API.

Each viewset exposes CRUD operations on the corresponding model using the
Django REST Framework's `ModelViewSet`.  Viewsets automatically provide
actions for listing, retrieving, creating, updating and deleting records.

Permissions are left open by default; in a production system you should
restrict access based on the logged‑in user's role (e.g. analyst vs
administrator) by adding appropriate permission classes.
"""

from rest_framework import viewsets

from . import models, serializers


class UserAccountViewSet(viewsets.ModelViewSet):
    queryset = models.UserAccount.objects.all()
    serializer_class = serializers.UserAccountSerializer


class AnalystViewSet(viewsets.ModelViewSet):
    queryset = models.Analyst.objects.all()
    serializer_class = serializers.AnalystSerializer


class AdministratorViewSet(viewsets.ModelViewSet):
    queryset = models.Administrator.objects.all()
    serializer_class = serializers.AdministratorSerializer


class SOPViewSet(viewsets.ModelViewSet):
    queryset = models.SOP.objects.all()
    serializer_class = serializers.SOPSerializer


class UserSOPActionViewSet(viewsets.ModelViewSet):
    queryset = models.UserSOPAction.objects.all()
    serializer_class = serializers.UserSOPActionSerializer


class ClientViewSet(viewsets.ModelViewSet):
    queryset = models.Client.objects.all()
    serializer_class = serializers.ClientSerializer


class WarehouseViewSet(viewsets.ModelViewSet):
    queryset = models.Warehouse.objects.all()
    serializer_class = serializers.WarehouseSerializer


class WarehouseClientLinkViewSet(viewsets.ModelViewSet):
    queryset = models.WarehouseClientLink.objects.all()
    serializer_class = serializers.WarehouseClientLinkSerializer


class LocationViewSet(viewsets.ModelViewSet):
    queryset = models.Location.objects.all()
    serializer_class = serializers.LocationSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = models.Equipment.objects.all()
    serializer_class = serializers.EquipmentSerializer


class MaintenanceLogViewSet(viewsets.ModelViewSet):
    queryset = models.MaintenanceLog.objects.all()
    serializer_class = serializers.MaintenanceLogSerializer


class SampleViewSet(viewsets.ModelViewSet):
    queryset = models.Sample.objects.all()
    serializer_class = serializers.SampleSerializer


class InProcessViewSet(viewsets.ModelViewSet):
    queryset = models.InProcess.objects.all()
    serializer_class = serializers.InProcessSerializer


class StabilityViewSet(viewsets.ModelViewSet):
    queryset = models.Stability.objects.all()
    serializer_class = serializers.StabilitySerializer


class FinishedProductViewSet(viewsets.ModelViewSet):
    queryset = models.FinishedProduct.objects.all()
    serializer_class = serializers.FinishedProductSerializer


class UserSampleActionViewSet(viewsets.ModelViewSet):
    queryset = models.UserSampleAction.objects.all()
    serializer_class = serializers.UserSampleActionSerializer


class TestViewSet(viewsets.ModelViewSet):
    queryset = models.Test.objects.all()
    serializer_class = serializers.TestSerializer


class SampleTestLinkViewSet(viewsets.ModelViewSet):
    queryset = models.SampleTestLink.objects.all()
    serializer_class = serializers.SampleTestLinkSerializer


class TestEquipmentLinkViewSet(viewsets.ModelViewSet):
    queryset = models.TestEquipmentLink.objects.all()
    serializer_class = serializers.TestEquipmentLinkSerializer


class ReagentViewSet(viewsets.ModelViewSet):
    queryset = models.Reagent.objects.all()
    serializer_class = serializers.ReagentSerializer


class UserReagentActionViewSet(viewsets.ModelViewSet):
    queryset = models.UserReagentAction.objects.all()
    serializer_class = serializers.UserReagentActionSerializer


class TestReagentLinkViewSet(viewsets.ModelViewSet):
    queryset = models.TestReagentLink.objects.all()
    serializer_class = serializers.TestReagentLinkSerializer


class VersionChangeViewSet(viewsets.ModelViewSet):
    queryset = models.VersionChange.objects.all()
    serializer_class = serializers.VersionChangeSerializer
