from music21 import note, duration

from music21.stream.base import Stream

from .utilities import get_xml_file

sixteenth_variants = ["1111", "112", "121", "211", "0111"]
sixteenth_durations = {
    "0": 0.25,
    "1": 0.25,
    "2": 0.5,
}

eight_variants = ["11", "01", "10"]
eight_durations = {
    "0": 0.5,
    "1": 0.5,
}


# TODO: figure out a way to make it only take in elements in
# 16th variants like you can in ts.
def get_sixteenth(var: str, tone: str) -> Stream:
    s = Stream()

    for _ in range(4):
        for length in var:
            dur = sixteenth_durations[length]
            if length == "0":
                r = note.Rest(duration=duration.Duration(dur))
                s.append(r)
            else:
                n = note.Note(tone, duration=duration.Duration(dur))
                s.append(n)

    return s


def get_eight(var: str, tone: str) -> Stream:
    s = Stream()

    for _ in range(4):
        for length in var:
            dur = eight_durations[length]

            if length == "0":
                r = note.Rest(duration=duration.Duration(dur))
                s.append(r)
                print("is this a rest?: ", r.isRest)
                print(r.duration)
            else:
                n = note.Note(tone, duration=duration.Duration(dur))
                s.append(n)
                print(n.duration)

    return s


def get_notes(type: int, var: str, tone: str) -> bytes:
    if type == 16:
        return get_xml_file(get_sixteenth(var, tone))
    elif type == 8:
        return get_xml_file(get_eight(var, tone))
    else:
        raise Exception("this rhythm is not supported")
