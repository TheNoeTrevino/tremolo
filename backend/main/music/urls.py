from django.urls import path
from . import views

urlpatterns = [
    path("marry", views.get_marry_had),
    path("test", views.get_random_notes),
]
