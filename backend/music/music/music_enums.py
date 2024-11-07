from music21 import note, chord


class DiatonicInformation:
    def __init__(self, root):
        self.root = note.Note(root)

    @property
    def second(self):
        return self.root.transpose("M2")

    @property
    def third(self):
        return self.root.transpose("M3")

    @property
    def fourth(self):
        return self.root.transpose("P4")

    @property
    def fifth(self):
        return self.root.transpose("P5")

    @property
    def sixth(self):
        return self.root.transpose("M6")

    @property
    def seventh(self):
        return self.root.transpose("M7")

    @property
    def I(self):
        return chord.Chord([self.root, self.third, self.fifth])

    @property
    def ii(self):
        return chord.Chord([self.second, self.fourth, self.sixth])

    @property
    def iii(self):
        return chord.Chord([self.third, self.fifth, self.seventh])

    @property
    def IV(self):
        return chord.Chord([self.fourth, self.sixth, self.root])

    @property
    def V(self):
        return chord.Chord([self.fifth, self.seventh, self.second])

    @property
    def vi(self):
        return chord.Chord([self.sixth, self.root, self.third])

    @property
    def vii(self):
        return chord.Chord([self.seventh, self.second, self.fourth])

    def marry_had(self):
        marry_notes = [
            self.third,
            self.second,
            self.root,
            self.second,
            self.third,
            self.third,
            self.third,
            self.I,
        ]
        return marry_notes


c_scale = DiatonicInformation("F4")
print(c_scale.root)
print(c_scale.second)
print(c_scale.third)
print(c_scale.I)
print(c_scale.IV)
print(c_scale.vii)
print(c_scale.marry_had())
