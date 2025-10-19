import "./App.css";
import React from "react";
import { getSheetMusic } from "./services/SheetMusicService";

// https://github.com/opensheetmusicdisplay/react-opensheetmusicdisplay
function App() {
	return (
		<div>
			<button type="button" className="btn btn-primary" onClick={getSheetMusic}>
				Open Sheet Music
			</button>
			<div
				id="sheet-music-div"
				style={{ width: "100%", height: "500px" }}
			></div>
		</div>
	);
}

export default App;
