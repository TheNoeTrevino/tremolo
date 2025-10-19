import { Box, Fade, Paper, Typography } from "@mui/material";
import InputFileUpload from "./FileUpload";
import { useState } from "react";
import { MusicService } from "../services/MusicService";
import { generatedMusicStyles } from "../styles";

const Converter = () => {
	const [isVisible, setVisibility] = useState<boolean>(false);

	return (
		//TODO: this looks horrible
		//
		<Fade in={true} timeout={500}>
			<Box>
				<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
					<Box sx={generatedMusicStyles.sheetMusicContainer}>
						<Paper
							id="sheet-music-div"
							elevation={6}
							sx={generatedMusicStyles.sheetMusic}
						>
							{!isVisible && (
								<Box>
									<Typography variant="h6" textAlign="center">
										Click the button below to upload the sheet music
									</Typography>
								</Box>
							)}
						</Paper>
					</Box>
				</Box>

				<Box>
					<InputFileUpload
						handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
							MusicService.displayXml(event.target.files);
							setVisibility(true);
						}}
					/>
				</Box>
			</Box>
		</Fade>
	);
};

export default Converter;
