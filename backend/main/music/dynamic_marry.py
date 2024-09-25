from music21 import interval, note, chord
from music21.stream.base import Stream
from music21.note import Note
from music21.interval import Interval

from .utilities import get_xml_file


# TODO: Overhaul this to use the scale thingy from music21
class DiatonicInformation:
    def __init__(self, root: str, octave: int):
        self._root = note.Note(root)
        self._root.octave = octave

        # diatonic chords
        self.I = [self.root, self.third, self.fifth]
        self.ii = [self.second, self.fourth, self.sixth]
        self.iii = [self.third, self.fifth, self.seventh]
        self.IV = [self.fourth, self.sixth, self.root]
        self.V = [self.fifth, self.seventh, self.second]
        self.vi = [self.sixth, self.root, self.third]
        self.vii = [self.seventh, self.second, self.fourth]

        self.notes = Stream()

    @property
    def root(self):
        return self._root

    @property
    def second(self):
        return self.transpose(self.root, interval.Interval("M2"))

    @property
    def third(self):
        return self.transpose(self.root, interval.Interval("M3"))

    @property
    def fourth(self):
        return self.transpose(self.root, interval.Interval("P4"))

    @property
    def fifth(self):
        return self.transpose(self.root, interval.Interval("P5"))

    @property
    def sixth(self):
        return self.transpose(self.root, interval.Interval("M6"))

    @property
    def seventh(self):
        return self.transpose(self.root, interval.Interval("M7"))

    def transpose(self, starting_note: Note, interval: Interval) -> Note:
        transposed_note = starting_note.transpose(interval)
        if transposed_note:
            return transposed_note
        else:
            raise Exception("this note is not real")

    def get_marry_had(self) -> bytes:
        marry_notes = [
            self.third,
            self.second,
            self.root,
            self.second,
            self.third,
            self.third,
            self.third,
            chord.Chord(self.I),
        ]

        for element in marry_notes:
            self.notes.append(element)

        return get_xml_file(self.notes)


# for future use?
scaleTones = {
    "C": ["C", "D", "E", "F", "G", "A", "B"],
    "Csharp": ["C#", "D#", "E#", "F#", "G#", "A#", "B#"],
    "D": ["D", "E", "F#", "G", "A", "B", "C#"],
    "Eb": ["E-", "F", "G", "A-", "B-", "C", "D"],
    "E": ["E", "F#", "G#", "A", "B", "C#", "D#"],
    "F": ["F", "G", "A", "B-", "C", "D", "E"],
    "Fsharp": ["F#", "G#", "A#", "B", "C#", "D#", "E#"],
    "G": ["G", "A", "B", "C", "D", "E", "F#"],
    "Ab": ["A-", "B-", "C", "D-", "E-", "F", "G"],
    "A": ["A", "B", "C#", "D", "E", "F#", "G#"],
    "Bb": ["B-", "C", "D", "E-", "F", "G", "A"],
    "B": ["B", "C#", "D#", "E", "F#", "G#", "A#"],
}
