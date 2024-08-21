from music21 import note, chord
from music21.stream.base import Stream
import os, tempfile

class MarryHad():
    def __init__(self):
        self.notes = Stream()
        
        marry_notes = [
            # objects cannot be repeated in stream, must be different instances
            note.Note('E4', quarterLength=0.5),
            note.Note('D4', quarterLength=0.5),
            note.Note('C4', quarterLength=0.5),
            note.Note('D4', quarterLength=0.5),
            note.Note('E4', quarterLength=0.5),
            note.Note('E4', quarterLength=0.5),
            note.Note('E4', quarterLength=1.0),
            chord.Chord(['C', 'E', 'G'])
        ]

        for element in marry_notes:
            self.notes.append(element)

    @property
    def midi_file(self):
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".mid") as tmp_file:
            self.notes.write('midi', fp=tmp_file.name)
            tmp_file_path = tmp_file.name

        with open(tmp_file_path, 'rb') as f:
            midi_bytes = f.read()

        os.remove(tmp_file_path)

        return midi_bytes

    @property
    def xml_file(self):
        
        with tempfile.NamedTemporaryFile(delete=False, suffix=".xml") as tmp_file:
            self.notes.write('xml', fp=tmp_file.name)
            tmp_file_path = tmp_file.name

        with open(tmp_file_path, 'rb') as f:
            midi_bytes = f.read()

        os.remove(tmp_file_path)

        return midi_bytes

