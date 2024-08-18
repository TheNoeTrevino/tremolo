from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def helloWorld(request):
    employees = {
        1: {
            "firstName": "Krish",
            "lastName": "Shahidadpury",
            "age": 24
            },
        2: {
            "firstName": "Noe",
            "lastName": "Trevino",
            "age": 24
            }
    }
    krish = employees[1]
    # value = krish.get('') < 10
    return Response(krish.get("age"))



