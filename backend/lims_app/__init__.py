"""
Application configuration for the LIMS backend.

This package contains the Django app responsible for modelling the database
schema defined in the prompt, exposing REST API endpoints for each model,
and registering models with the Django admin.  Breaking the project into a
separate app makes it easy to reuse these models in other projects if
desired.
"""
