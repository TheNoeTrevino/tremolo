from django.urls import path
from . import views

urlpatterns = [
<<<<<<< HEAD
    path("mary", views.get_mary_had),
    path("test", views.get_random_notes),
||||||| 0a4f4fa
    path('', views.helloWorld),
=======
    path('midi', views.test_midi),
    path('xml', views.test_xml),
>>>>>>> main
]
