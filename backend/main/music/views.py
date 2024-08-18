from rest_framework.response import Response
from rest_framework.decorators import api_view

@api_view(['GET'])
def helloWorld(request):
    item = {
        'message': 'hello world!'
    }
    return Response(item)
