from rest_framework.decorators import api_view
from rest_framework.request import Request
from django.http import HttpResponse
from rest_framework.views import Response

from .library import get_notes
from .dynamic_mary import DiatonicInformation
from rest_framework import status


@api_view(["POST"])
def get_mary_had(request: Request):
    if request.method == "POST":
        tonic: str = request.data.get("tonic")  # type: ignore it is going crazy
        octave: int = int(request.data.get("octave"))  # type: ignore it is going crazy

        try:
            music = DiatonicInformation(tonic, octave).get_mary_had()
        # out of the twelve tone system
        except Exception as e:
            return Response(
                f"The note {e} is not currently supported, reconsider you root note",
                status=status.HTTP_400_BAD_REQUEST,
            )

        # TODO: move this to a service
        response = HttpResponse(music, content_type="application/xml")
        response["Content-Disposition"] = 'attachment; filename="test.xml"'
        return response


@api_view(["POST"])
def get_random_notes(request: Request):
    if request.method == "POST":
        variant: str = request.data.get("rhythm")  # type: ignore
        type: int = request.data.get("rhythmType")  # type: ignore
        tone: str = request.data.get("tonic")  # type: ignore

        try:
            music = get_notes(type, variant, tone)

        # out of the twelve tone system
        except Exception as e:
            e = str(e)
            return Response(
                f"something is not right!{e}",
                status=status.HTTP_400_BAD_REQUEST,
            )

        # TODO: move this to a service
        response = HttpResponse(music, content_type="application/xml")
        response["Content-Disposition"] = 'attachment; filename="test.xml"'
        return response
