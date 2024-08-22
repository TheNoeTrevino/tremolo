from rest_framework.decorators import api_view
from django.http import HttpResponse
from .testclass import MarryHad#use relative imports or else an error appears

music = MarryHad()

@api_view(["GET"])
def test_midi(request):
    response = HttpResponse(music.midi_file, content_type='audio/midi')
    response['Content-Disposition'] = 'attachment; filename="test.mid"'
    return response

@api_view(["GET"])
def test_xml(request):
    response = HttpResponse(music.xml_file, content_type='application/xml')
    response['Content-Disposition'] = 'attachment; filename="test.xml"'
    return response
