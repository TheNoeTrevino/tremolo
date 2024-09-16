import axios from "axios";
import { OpenSheetMusicDisplay } from "opensheetmusicdisplay";

//https://github.com/axios/axios?tab=readme-ov-file#example
//TODO: change this to use the params version on the github page
//send user options when we are done making our modular class
export async function getSheetMusic() {
  try {
    const response = await axios.get("http://127.0.0.1:8000/xml", {
      responseType: "text",
    });

    const xml = response.data;
    const container = document.getElementById("sheet-music-div");
    const osmd = new OpenSheetMusicDisplay(container);

    await osmd.load(xml);
    osmd.render();
  } catch (error) {
    console.error("did not get sheet music", error);
  }
}
