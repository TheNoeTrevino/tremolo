import axios from "axios";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";
import {
  BasicAudioPlayer,
  LinearTimingSource,
  PlaybackManager,
} from "../pages/music-display/Playback";

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

      await osmd.load(xml).then(() => {
        const timingSource: LinearTimingSource = new LinearTimingSource();
        timingSource.Settings = osmd.Sheet.SheetPlaybackSetting;
        timingSource.logEnabled = false;
        const playbackManager: PlaybackManager = new PlaybackManager(
          timingSource,
          undefined,
          new BasicAudioPlayer(),
          undefined,
        );
      });
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
