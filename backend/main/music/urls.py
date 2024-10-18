from django.urls import path
from . import views

urlpatterns = [
    path("mary", views.get_mary_had),
    path("random", views.get_random_notes),
]
