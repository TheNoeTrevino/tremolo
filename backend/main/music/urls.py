from django.urls import path
from . import views

urlpatterns = [
    path('midi', views.test_midi),
    path('xml', views.test_xml),
]
