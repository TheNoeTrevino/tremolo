export interface rhythmMusicProps {
  scale: string;
  octave: string;
  rhythmType: number;
  rhythm: string;
}

export interface generatedMusicProps {
  scale: string;
  octave: string;
}

export interface noteGameProps {
  noteName: string;
  octave: string;
  fullNoteName: string;
}

export interface NoteGameDTO {
  generatedXml: string;
  noteName: string;
  noteOctave: string;
}
