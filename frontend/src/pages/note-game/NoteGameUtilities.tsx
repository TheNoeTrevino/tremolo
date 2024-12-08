const c4sound = "/audio/marimba-c4.mp3";
const csharp4sound = "/audio/marimba-csharp4.mp3";
const d4sound = "/audio/marimba-d4.mp3";
const dsharp4sound = "/audio/marimba-dsharp4.mp3";
const e4sound = "/audio/marimba-e4.mp3";
const f4sound = "/audio/marimba-f4.mp3";
const fsharp4sound = "/audio/marimba-fsharp4.mp3";
const g4sound = "/audio/marimba-g4.mp3";
const gsharp4sound = "/audio/marimba-gsharp4.mp3";
const a4sound = "/audio/marimba-a4.mp3";
const asharp4sound = "/audio/marimba-asharp4.mp3";
const b4sound = "/audio/marimba-b4.mp3";

const noteToSound: Record<string, string> = {
  C4: c4sound,
  "C#4": csharp4sound,
  "D-4": csharp4sound,
  D4: d4sound,
  "D#4": dsharp4sound,
  "E-4": dsharp4sound,
  E4: e4sound,
  F4: f4sound,
  "F#4": fsharp4sound,
  "G-4": fsharp4sound,
  G4: g4sound,
  "G#4": gsharp4sound,
  "A-4": a4sound,
  A4: a4sound,
  "A#4": asharp4sound,
  "B-4": asharp4sound,
  B4: b4sound,
};

// TODO: make this take in type of keydown, what ever that is
// also make a vim version lol
const keypressToNote: Record<string, string> = {
  a: "C",
  w: "D-",
  s: "D",
  e: "E-",
  d: "E",
  f: "F",
  t: "G-",
  g: "G",
  y: "A-",
  h: "A",
  u: "B-",
  j: "B",
  k: "C",
};

export { noteToSound, keypressToNote };
