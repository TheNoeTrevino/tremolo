# from rest_framework.response import Response
from rest_framework.decorators import api_view
from django.http import HttpResponse
from .testmidi import  marry_had #use relative imports or else an error appears
import os, tempfile

@api_view(["GET"])
def test_midi(request):
    midi_stream = marry_had()
        
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mid") as tmp_file:
        midi_stream.write('midi', fp=tmp_file.name)
        tmp_file_path = tmp_file.name

    with open(tmp_file_path, 'rb') as f:
        midi_bytes = f.read()

    os.remove(tmp_file_path)

    response = HttpResponse(midi_bytes, content_type='audio/midi')
    response['Content-Disposition'] = 'attachment; filename="test.mid"'
    return response
