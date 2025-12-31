from django.apps import AppConfig


class LimsAppConfig(AppConfig):
    """Configuration for the LIMS application.

    This config ensures Django recognises the app and can perform model
    discovery.  It also allows you to hook into application initialisation if
    you need to register signals or perform other startup tasks.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "lims_app"
