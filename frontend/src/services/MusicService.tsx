import axios from "axios";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

interface rhythmMusic {
  scale: string;
  octave: string;
  rhythmType: number;
  rhythm: string;
}

interface generatedMusicProps {
  scale: string;
  octave: string;
}

export async function getMaryMusic({
  scale,
  octave,
}: generatedMusicProps): Promise<void> {
  try {
    const response = await axios.post<string>(
      "http://127.0.0.1:8000/mary",
      { tonic: scale, octave: octave },
      { responseType: "text" },
    );

    const generatedXml = response.data;
    const sheetMusicContainer = document.getElementById("sheet-music-div");

    if (!sheetMusicContainer) {
      console.error("Could not find the sheet music container");
      return;
    }

    const osmd = new OpenSheetMusicDisplay(sheetMusicContainer as HTMLElement);

    await osmd.load(generatedXml);
    osmd.render();
  } catch (error) {
    console.error("Did not get sheet music", error);
  }
}

export async function getRhythmMusic({
  scale,
  octave,
  rhythmType,
  rhythm,
}: rhythmMusic): Promise<void> {
  try {
    const response = await axios.post<string>(
      "http://127.0.0.1:8000/random",
      { tonic: scale + octave, rhythmType: rhythmType, rhythm: rhythm },
      { responseType: "text" },
    );

    const generatedXml = response.data;
    const sheetMusicContainer = document.getElementById("sheet-music-div");

    if (!sheetMusicContainer) {
      console.error("Could not find the sheet music container");
      return;
    }

    const osmd = new OpenSheetMusicDisplay(sheetMusicContainer as HTMLElement);

    await osmd.load(generatedXml);
    osmd.render();
  } catch (error) {
    console.error("Did not get sheet music", error);
  }
}

export async function displayXml(
  selectedFiles: FileList | null,
): Promise<void> {
  const sheetMusicContainer = document.getElementById("sheet-music-div");

  if (!selectedFiles) {
    console.error("Files were not uploaded correctly");
    return;
  }

  if (selectedFiles.length > 1) {
    alert("Currently, only one file at a time is supported");
    return;
  }

  const fileToConvert = selectedFiles[0];

  if (!sheetMusicContainer) {
    console.error(
      "could not find the sheet music container. should be 'sheet-music-div'.",
    );
    return;
  }

  const osmd = new OpenSheetMusicDisplay(sheetMusicContainer as HTMLElement);

  if (!fileToConvert) {
    console.error("an error occurred rendering the sheet music.");
    return;
  }

  try {
    const filesAsXml = await readFileAsText(fileToConvert);
    await osmd.load(filesAsXml);
    osmd.render();
  } catch (error) {
    console.error("Error rendering sheet music", error);
  }
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(reader.error);
    reader.readAsText(file);
  });
}

export async function getNoteGameXml(
  scale: string,
  octave: string,
): Promise<void> {
  try {
    const response = await axios.post<string>(
      "http://127.0.0.1:8000/note-game",
      { scale: scale, octave: octave },
      { responseType: "text" },
    );
    const generatedXml = response.data;
    const sheetMusicContainer = document.getElementById("sheet-music-div");

    if (!sheetMusicContainer) {
      console.error("Could not find the sheet music container");
      return;
    }

    const osmd = new OpenSheetMusicDisplay(sheetMusicContainer as HTMLElement);

    await osmd.load(generatedXml);
    osmd.render();
  } catch (error) {
    console.error(
      `did not get sheet music, params: scale: ${scale}, octave: ${octave} `,
      error,
    );
  }
}
