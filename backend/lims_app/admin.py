"""
Django admin registrations for the LIMS backend.

Registering models here allows you to browse and manage all tables via
the Django admin site.  You can customise list displays, search fields
and filters to make administration easier.  For brevity, this file
registers all models with default configuration.
"""

from django.contrib import admin

from . import models


admin.site.register(models.UserAccount)
admin.site.register(models.Analyst)
admin.site.register(models.Administrator)
admin.site.register(models.SOP)
admin.site.register(models.UserSOPAction)
admin.site.register(models.Client)
admin.site.register(models.Warehouse)
admin.site.register(models.WarehouseClientLink)
admin.site.register(models.Location)
admin.site.register(models.Equipment)
admin.site.register(models.MaintenanceLog)
admin.site.register(models.Sample)
admin.site.register(models.InProcess)
admin.site.register(models.Stability)
admin.site.register(models.FinishedProduct)
admin.site.register(models.UserSampleAction)
admin.site.register(models.Test)
admin.site.register(models.SampleTestLink)
admin.site.register(models.TestEquipmentLink)
admin.site.register(models.Reagent)
admin.site.register(models.UserReagentAction)
admin.site.register(models.TestReagentLink)
admin.site.register(models.VersionChange)
