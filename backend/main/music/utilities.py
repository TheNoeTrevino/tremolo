from _typeshed import FileDescriptorOrPath
from enum import Enum
from pathlib import Path
import os, tempfile

from music21 import metadata
from music21 import converter
from music21.stream.base import Stream


def get_xml_file(stream: Stream) -> bytes:
    """Takes in a stream and converts it to xml, which is returned"""
    stream = clean_stream(stream)

    with tempfile.NamedTemporaryFile(delete=False, suffix=".xml") as tmp_file:
        stream.write("xml", fp=tmp_file.name)
        tmp_file_path = tmp_file.name

    with open(tmp_file_path, "rb") as f:
        xml_bytes = f.read()

    os.remove(tmp_file_path)

    return xml_bytes


def midi_to_xml(file: bytes | Path):
    """
    Takes in a file path or string and convertes it into a Stream.Score.
    Then, made into an xml file which is returned.
    """
    score = converter.parse(file)

    return get_xml_file(score)


# NOTE: not used, as xml is all we really need
def get_midi_file(stream: Stream) -> bytes:

    with tempfile.NamedTemporaryFile(delete=False, suffix=".mid") as tmp_file:
        stream.write("midi", fp=tmp_file.name)
        tmp_file_path = tmp_file.name

    with open(tmp_file_path, "rb") as f:
        midi_bytes = f.read()

    os.remove(tmp_file_path)

    return midi_bytes


def clean_stream(s: Stream):
    """
    Takes in a stream, removes its Title and Composer
    """
    # TODO: remove more things, and add an optional
    # parameter that can take in an instrument name, and set the instrument
    # to that
    s.metadata = metadata.Metadata()
    s.metadata.title = ""
    s.metadata.composer = ""
    return s


# NOTE: no longer used
# WARNING: could be useful later though? just keep it
class Tones(Enum):
    A0 = 21
    ASharp0 = 22
    BFlat0 = 22
    B0 = 23
    C1 = 24
    CSharp1 = 25
    DFlat1 = 25
    D1 = 26
    DSharp1 = 27
    EFlat1 = 27
    E1 = 28
    F1 = 29
    FSharp1 = 30
    GFlat1 = 30
    G1 = 31
    GSharp1 = 32
    AFlat1 = 32
    A1 = 33
    ASharp1 = 34
    BFlat1 = 34
    B1 = 35
    C2 = 36  # below bass clef
    CSharp2 = 37
    DFlat2 = 37
    D2 = 38
    DSharp2 = 39
    EFlat2 = 39
    E2 = 40
    F2 = 41
    FSharp2 = 42
    GFlat2 = 42
    G2 = 43
    GSharp2 = 44
    AFlat2 = 44
    A2 = 45
    ASharp2 = 46
    BFlat2 = 46
    B2 = 47
    C3 = 48  # in bass clef
    CSharp3 = 49
    DFlat3 = 49
    D3 = 50
    DSharp3 = 51
    EFlat3 = 51
    E3 = 52
    F3 = 53
    FSharp3 = 54
    GFlat3 = 54
    G3 = 55
    GSharp3 = 56
    AFlat3 = 56
    A3 = 57
    ASharp3 = 58
    BFlat3 = 58
    B3 = 59
    C4 = 60  # middle C
    CSharp4 = 61
    DFlat4 = 61
    D4 = 62
    DSharp4 = 63
    EFlat4 = 63
    E4 = 64
    F4 = 65
    FSharp4 = 66
    GFlat4 = 66
    G4 = 67
    GSharp4 = 68
    AFlat4 = 68
    A4 = 69
    ASharp4 = 70
    BFlat4 = 70
    B4 = 71
    C5 = 72  # middle of treble clef
    CSharp5 = 73
    DFlat5 = 73
    D5 = 74
    DSharp5 = 75
    EFlat5 = 75
    E5 = 76
    F5 = 77
    FSharp5 = 78
    GFlat5 = 78
    G5 = 79
    GSharp5 = 80
    AFlat5 = 80
    A5 = 81
    ASharp5 = 82
    BFlat5 = 82
    B5 = 83
    C6 = 84  # above the staff
    CSharp6 = 85
    DFlat6 = 85
    D6 = 86
    DSharp6 = 87
    EFlat6 = 87
    E6 = 88
    F6 = 89
    FSharp6 = 90
    GFlat6 = 90
    G6 = 91
    GSharp6 = 92
    AFlat6 = 92
    A6 = 93
    ASharp6 = 94
    BFlat6 = 94
    B6 = 95
    C7 = 96  # picollo
    CSharp7 = 97
    DFlat7 = 97
    D7 = 98
    DSharp7 = 99
    EFlat7 = 99
    E7 = 100
    F7 = 101
    FSharp7 = 102
    GFlat7 = 102
    G7 = 103
    GSharp7 = 104
    AFlat7 = 104
    A7 = 105
    ASharp7 = 106
    BFlat7 = 106
    B7 = 107
    C8 = 108
    CSharp8 = 109
    DFlat8 = 109
    D8 = 110
    DSharp8 = 111
    EFlat8 = 111
    E8 = 112
    F8 = 113
    FSharp8 = 114
    GFlat8 = 114
    G8 = 115
    GSharp8 = 116
    AFlat8 = 116
    A8 = 117
    ASharp8 = 118
    BFlat8 = 118
    B8 = 119
    C9 = 120


# NOTE: no longer used
class TransposedTones:
    def __init__(self, root: str):

        root_value = Tones[root].value

        self.tones = {}

        for tone in Tones:

            shifted_value = tone.value - root_value

            self.tones[shifted_value] = tone.name
            # NOTE: this could be problematic for more complicated use cases,
            # but this literally a sight reading app so it not suppose to be complicated
            # definitley something to watch out for
            # example output when we set the root note to middleC:
