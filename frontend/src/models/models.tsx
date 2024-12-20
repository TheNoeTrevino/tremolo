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

export interface UserDTO {
  firstName: string;
  lastName: string;
  age: number;
  email: string;
}

// fix the any here with the proper ones
export interface entryDTO {
  ID: number;
  TimeLength: any;
  CreatedDate: any;
  CreatedTime: any;
  TotalQuestions: number;
  CorrectQuestions: number;
  NPM: number;
}

// fix the any here with the proper ones
export interface schoolDTO {
  ID: number;
  Title: string;
  City: string;
  County: string;
  State: string;
  Country: string;
  CreatedDate: any;
  CreatedTime: any;
}
