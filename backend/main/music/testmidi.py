from music21 import note, chord
from music21.stream.base import Stream

def marry_had():
    midi_stream = Stream()

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
        midi_stream.append(element)

    return midi_stream
