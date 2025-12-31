"""
Django model definitions for the LIMS backend.

Each class in this module corresponds to one of the tables defined in the SQL
schema provided by the user.  Relationships between models are represented
using foreign keys, one-to-one fields and many-to-one relations.  Where the
original schema used sequences for primary keys, Django's built‑in
auto‑incrementing primary keys are used instead.  Decimal fields are used
for numeric columns to preserve precision.

The `SOP.save()` method implements the version change trigger from the SQL
schema: whenever the version number or effective date is modified on an
existing SOP, a `VersionChange` record is created automatically.
"""

from __future__ import annotations

from django.db import models
from django.utils import timezone


class UserAccount(models.Model):
    """Represents a system user.

    Fields correspond closely to the columns in the original `UserAccount`
    table.  Boolean fields are used for `training_completed`, `is_analyst` and
    `is_administrator` to simplify working with true/false values.  Username
    and email fields are unique to prevent duplicate accounts.
    """

    account_username = models.CharField(max_length=64, unique=True)
    first_name = models.CharField(max_length=64)
    last_name = models.CharField(max_length=64)
    phone = models.CharField(max_length=16)
    email = models.EmailField(max_length=255, unique=True)
    department = models.CharField(max_length=255)
    training_completed = models.BooleanField(default=False)
    is_analyst = models.BooleanField(default=False)
    is_administrator = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.account_username


class Analyst(models.Model):
    """Profile model for analysts.

    Each analyst is linked to a single `UserAccount`.  The `access_level`
    field is constrained to small integers for clarity; you could enforce a
    maximum in form validation or via a custom validator.
    """

    user_account = models.OneToOneField(
        UserAccount,
        on_delete=models.CASCADE,
        related_name="analyst_profile",
    )
    access_level = models.PositiveSmallIntegerField()
    analyst_supervisor = models.CharField(max_length=64)

    def __str__(self) -> str:
        return f"Analyst {self.user_account.account_username}"


class Administrator(models.Model):
    """Profile model for administrators.

    Tied one‑to‑one with a `UserAccount`.  The `is_supervisor` flag indicates
    whether the administrator supervises other administrators or analysts.
    """

    user_account = models.OneToOneField(
        UserAccount,
        on_delete=models.CASCADE,
        related_name="admin_profile",
    )
    is_supervisor = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"Administrator {self.user_account.account_username}"


class SOP(models.Model):
    """Standard operating procedures.

    Versioning is handled automatically: when an existing SOP record is
    updated and either its version number or effective date changes, a
    corresponding `VersionChange` record is created.  See the override of
    `save()` below.
    """

    sop_name = models.CharField(max_length=16)
    version_number = models.DecimalField(max_digits=3, decimal_places=1)
    effective_date = models.DateField()

    def __str__(self) -> str:
        return f"{self.sop_name} v{self.version_number}"

    def save(self, *args, **kwargs) -> None:
        creating = self.pk is None
        # Only perform version change logging on updates (not creates)
        if not creating:
            old = SOP.objects.get(pk=self.pk)
            if (
                old.version_number != self.version_number
                or old.effective_date != self.effective_date
            ):
                # Import inside to avoid circular import issues
                VersionChange.objects.create(
                    old_version_number=old.version_number,
                    new_version_number=self.version_number,
                    old_effective_date=old.effective_date,
                    new_effective_date=self.effective_date,
                    sop=self,
                    change_date=timezone.now(),
                )
        super().save(*args, **kwargs)


class UserSOPAction(models.Model):
    """Records actions taken by users on SOPs (QA authoring/reviewing/approval)."""

    user_account = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    sop = models.ForeignKey(SOP, on_delete=models.CASCADE)
    qa_author = models.CharField(max_length=64)
    qa_reviewer = models.CharField(max_length=64)
    qa_approver = models.CharField(max_length=64)

    def __str__(self) -> str:
        return f"{self.user_account} → {self.sop}"


class Client(models.Model):
    """Represents an external client (customer)."""

    client_name = models.CharField(max_length=64, unique=True)

    def __str__(self) -> str:
        return self.client_name


class Warehouse(models.Model):
    """Represents a warehouse facility.

    Each warehouse is linked to an SOP which governs its procedures.
    """

    sop = models.ForeignKey(SOP, on_delete=models.CASCADE)
    warehouse_technician = models.CharField(max_length=64)
    warehouse_facility = models.CharField(max_length=64)
    warehouse_company = models.CharField(max_length=64)

    class Meta:
        unique_together = ("warehouse_facility", "warehouse_company")

    def __str__(self) -> str:
        return f"{self.warehouse_company} – {self.warehouse_facility}"


class WarehouseClientLink(models.Model):
    """Links warehouses to clients, recording shipments."""

    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    client = models.ForeignKey(Client, on_delete=models.CASCADE)
    quantity_shipped = models.DecimalField(max_digits=4, decimal_places=0)
    delivery_service = models.CharField(max_length=64)
    shipping_time = models.DateTimeField()
    delivery_time = models.DateTimeField()
    acceptable_delivery = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"Shipment {self.pk} from {self.warehouse} to {self.client}"


class Location(models.Model):
    """Represents a physical location (room or area)."""

    location_type = models.CharField(max_length=64, null=True, blank=True)
    room_number = models.PositiveIntegerField()

    def __str__(self) -> str:
        return f"{self.location_type or 'Room'} {self.room_number}"


class Equipment(models.Model):
    """Laboratory equipment or instruments."""

    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    sop = models.ForeignKey(SOP, on_delete=models.CASCADE)
    equipment_name = models.CharField(max_length=64)
    min_use_range = models.DecimalField(max_digits=16, decimal_places=6)
    max_use_range = models.DecimalField(max_digits=16, decimal_places=6)
    in_use = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.equipment_name


class MaintenanceLog(models.Model):
    """Records equipment maintenance events."""

    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)
    sop = models.ForeignKey(SOP, on_delete=models.CASCADE)
    service_date = models.DateField()
    service_description = models.TextField()
    service_interval = models.CharField(max_length=64)
    next_service_date = models.DateField()

    def __str__(self) -> str:
        return f"Maintenance {self.pk} on {self.equipment}"


class Sample(models.Model):
    """Represents a product sample.

    Samples belong to a location and warehouse and are associated with an SOP.
    The `sample_type` field uses a single character to indicate the type:
    I = InProcess, S = Stability, F = FinishedProduct.
    """

    location = models.ForeignKey(Location, on_delete=models.CASCADE)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE)
    sop = models.ForeignKey(SOP, on_delete=models.CASCADE)
    product_name = models.CharField(max_length=64)
    product_stage = models.CharField(max_length=64)
    quantity = models.DecimalField(max_digits=4, decimal_places=0)
    time_received = models.DateTimeField(default=timezone.now)
    sample_type = models.CharField(max_length=1, choices=[("I", "InProcess"), ("S", "Stability"), ("F", "FinishedProduct")])
    storage_conditions = models.CharField(max_length=5)

    def __str__(self) -> str:
        return f"Sample {self.pk} ({self.product_name})"


class InProcess(models.Model):
    """Detail for in-process samples."""

    sample = models.OneToOneField(Sample, on_delete=models.CASCADE, primary_key=True)
    time_sampled = models.DateTimeField()

    def __str__(self) -> str:
        return f"InProcess {self.sample}"


class Stability(models.Model):
    """Detail for stability samples."""

    sample = models.OneToOneField(Sample, on_delete=models.CASCADE, primary_key=True)
    stability_conditions = models.CharField(max_length=64)

    def __str__(self) -> str:
        return f"Stability {self.sample}"


class FinishedProduct(models.Model):
    """Detail for finished product samples."""

    sample = models.OneToOneField(Sample, on_delete=models.CASCADE, primary_key=True)
    product_lot_number = models.DecimalField(max_digits=16, decimal_places=0)

    def __str__(self) -> str:
        return f"Finished {self.sample}"


class UserSampleAction(models.Model):
    """Logs actions that users perform on samples."""

    user_account = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    sample = models.ForeignKey(Sample, on_delete=models.CASCADE)
    receiving_analyst = models.CharField(max_length=64)
    aliquoting_analyst = models.CharField(max_length=64, null=True, blank=True)

    def __str__(self) -> str:
        return f"Sample action by {self.user_account} on {self.sample}"


class Test(models.Model):
    """Represents a laboratory test procedure."""

    user_account = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    sop = models.ForeignKey(SOP, on_delete=models.CASCADE, unique=True)
    min_acceptable_result = models.DecimalField(max_digits=16, decimal_places=6, null=True, blank=True)
    max_acceptable_result = models.DecimalField(max_digits=16, decimal_places=6, null=True, blank=True)

    def __str__(self) -> str:
        return f"Test {self.pk} for SOP {self.sop}"


class SampleTestLink(models.Model):
    """Links samples to tests and stores results."""

    sample = models.ForeignKey(Sample, on_delete=models.CASCADE)
    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    testing_analyst = models.CharField(max_length=64)
    reviewing_analyst = models.CharField(max_length=64)
    test_result = models.DecimalField(max_digits=16, decimal_places=6)
    deadline = models.DateTimeField()
    pass_or_fail = models.BooleanField(default=False)

    def __str__(self) -> str:
        return f"SampleTestLink {self.pk}"


class TestEquipmentLink(models.Model):
    """Associates tests with the equipment used."""

    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"TestEquipmentLink {self.pk}"


class Reagent(models.Model):
    """Chemical or reagent used in laboratory procedures."""

    sop = models.ForeignKey(SOP, on_delete=models.CASCADE)
    reagent_name = models.CharField(max_length=255)
    cas_number = models.CharField(max_length=12)
    lot_number = models.CharField(max_length=255)
    vendor = models.CharField(max_length=255)
    manufacturing_date = models.DateField()
    expiration_date = models.DateField()

    def __str__(self) -> str:
        return self.reagent_name


class UserReagentAction(models.Model):
    """Logs actions users take with reagents."""

    user_account = models.ForeignKey(UserAccount, on_delete=models.CASCADE)
    reagent = models.ForeignKey(Reagent, on_delete=models.CASCADE)
    reagent_manager = models.CharField(max_length=64)

    def __str__(self) -> str:
        return f"{self.user_account} handled {self.reagent}"


class TestReagentLink(models.Model):
    """Associates tests with reagents used and records the volume used."""

    test = models.ForeignKey(Test, on_delete=models.CASCADE)
    reagent = models.ForeignKey(Reagent, on_delete=models.CASCADE)
    volume_used = models.DecimalField(max_digits=16, decimal_places=6)

    def __str__(self) -> str:
        return f"TestReagentLink {self.pk}"


class VersionChange(models.Model):
    """Logs changes to SOP version numbers and effective dates."""

    old_version_number = models.DecimalField(max_digits=3, decimal_places=1)
    new_version_number = models.DecimalField(max_digits=3, decimal_places=1)
    old_effective_date = models.DateField()
    new_effective_date = models.DateField()
    sop = models.ForeignKey(SOP, on_delete=models.CASCADE)
    change_date = models.DateField()

    def __str__(self) -> str:
        return f"Version change on {self.sop}"
