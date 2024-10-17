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

    const xml = response.data;
    const container = document.getElementById("sheet-music-div");

    // Ensure the container is not null and is an HTML element
    if (container) {
      const osmd = new OpenSheetMusicDisplay(container as HTMLElement);

      await osmd.load(xml);
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
      "http://127.0.0.1:8000/random",
      // below is the sent info
      // choice,
      { tonic: scale + octave, rhythmType: rhythmType, rhythm: rhythm },
      { responseType: "text" },
    );

    const xml = response.data;
    const container = document.getElementById("sheet-music-div");

    // Ensure the container is not null and is an HTML element
    if (container) {
      const osmd = new OpenSheetMusicDisplay(container as HTMLElement);

      await osmd.load(xml);
      osmd.render();
    } else {
      console.error("Could not find the sheet music container");
    }
  } catch (error) {
    console.error("Did not get sheet music", error);
  }
}

export async function getNoteGameXml(
  scale: string,
  octave: string,
): Promise<void> {
  try {
    const response = await axios.post<string>(
      "http://127.0.0.1:8000/note_game",
      { scale: scale, octave: octave },
    );
    const xml = response.data;
    const container = document.getElementById("sheet-music-div");

    // Ensure the container is not null and is an HTML element
    if (container) {
      const osmd = new OpenSheetMusicDisplay(container as HTMLElement);

      await osmd.load(xml);
      osmd.render();
    } else {
      console.error("Could not find the sheet music container");
    }
  } catch (error) {
    console.error("did not get sheet music, params: ${noteParams}", error);
  }
}

export async function displayXml(files: FileList | null): Promise<void> {
  const container = document.getElementById("sheet-music-div");
  if (files) {
    const file = files[0];

    if (container) {
      const osmd = new OpenSheetMusicDisplay(container as HTMLElement);

      if (file) {
        try {
          const xml = await readFileAsText(file);
          await osmd.load(xml);
          osmd.render();
        } catch (error) {
          console.error("Error rendering sheet music", error);
        }
      } else {
        alert("an error occurred rendering the sheet music.");
      }
    } else {
      console.error(
        "could not find the sheet music container. should be 'sheet-music-div'.",
      );
    }
  } else {
    alert("something strange happened");
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
