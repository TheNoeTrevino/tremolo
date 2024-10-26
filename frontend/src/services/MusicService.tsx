import axios from "axios";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

interface maryMusic {
  scale: string;
  octave: string;
}

interface rhythmMusic {
  scale: string;
  octave: string;
  //TODO: make this more type safe
  rhythmType: number;
  // maybe make this an int?
  rhythm: string;
}

export async function getMaryMusic({
  scale,
  octave,
}: maryMusic): Promise<void> {
  try {
    const response = await axios.post<string>(
      "http://127.0.0.1:8000/mary",
      { tonic: scale, octave: octave },
      { responseType: "text" },
    );

    const generatedXml = response.data;
    const sheetMusicContainer = document.getElementById("sheet-music-div");

    // Ensure the container is not null and is an HTML element
    if (sheetMusicContainer) {
      const osmd = new OpenSheetMusicDisplay(
        sheetMusicContainer as HTMLElement,
      );

      await osmd.load(generatedXml);
      osmd.render();
    } else {
      console.error("Could not find the sheet music container");
    }
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
      "http://127.0.0.1:8000/test",
      // below is the sent info
      // choice,
      { tonic: scale + octave, rhythmType: rhythmType, rhythm: rhythm },
      { responseType: "text" },
    );

    const generatedXml = response.data;
    const sheetMusicContainer = document.getElementById("sheet-music-div");

    // Ensure the container is not null and is an HTML element
    if (sheetMusicContainer) {
      const osmd = new OpenSheetMusicDisplay(
        sheetMusicContainer as HTMLElement,
      );

      await osmd.load(generatedXml);
      osmd.render();
    } else {
      console.error("Could not find the sheet music container");
    }
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
