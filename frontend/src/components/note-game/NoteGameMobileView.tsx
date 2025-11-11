import { Box, Card, Typography, Button } from "@mui/material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { noteGameStyles } from "../../pages/note-game/NoteGameStyles";
import MusicButton from "../musical/MusicButton";
import { scaleOptions, octaveOptions } from "../musical/MusicalOptions";
import {
	sharpOptions,
	naturalOptions,
	flatOptions,
} from "../musical/MusicalOptions";
import { NoteGameViewProps } from "./NoteGameViewProps";

const totalOptions = [sharpOptions, naturalOptions, flatOptions];

export const NoteGameMobileView = ({
	correctCounter,
	totalCounter,
	currentTime,
	startTime,
	scaleAnchorEl,
	octaveAnchorEl,
	openScaleOptions,
	openOctaveOptions,
	handleScaleClick,
	handleOctaveClick,
	handleScaleClose,
	handleOctaveClose,
	chooseScale,
	chooseOctave,
	onAnswer,
}: NoteGameViewProps) => {
	return (
		<>
			<Box sx={noteGameStyles.mobileScoreboardStrip}>
				{isNaN(correctCounter / totalCounter) ? (
					<Typography fontSize="0.875rem" textAlign="center">
						Answer to start!
					</Typography>
				) : (
					<>
						<Typography fontSize="0.875rem" fontWeight="500">
							{correctCounter / totalCounter === 1
								? "100%"
								: `${Math.round((correctCounter / totalCounter) * 100)}%`}
						</Typography>
						<Typography fontSize="0.875rem">
							{correctCounter}/{totalCounter}
						</Typography>
						<Typography fontSize="0.875rem">
							NPM:{" "}
							{Math.floor((totalCounter / (currentTime - startTime)) * 100)}
						</Typography>
					</>
				)}
			</Box>

			<Card sx={noteGameStyles.mobileMusicCard}>
				<Box id="sheet-music-div" sx={noteGameStyles.mobileMusicDisplay}></Box>
			</Card>

			<Box sx={noteGameStyles.mobileAnswerButtonsContainer}>
				{totalOptions.map((optionList, index) => (
					<Box key={index} sx={noteGameStyles.mobileButtonRow}>
						{optionList.map((option) => (
							<Button
								key={option.value}
								variant="contained"
								sx={noteGameStyles.mobileAnswerButton}
								onClick={() => onAnswer(option.value)}
							>
								{option.name}
							</Button>
						))}
					</Box>
				))}
			</Box>

			<Box sx={noteGameStyles.stickyControlsBar}>
				<MusicButton
					text="Scale"
					handleClick={handleScaleClick}
					options={scaleOptions}
					anchorEl={scaleAnchorEl}
					open={openScaleOptions}
					handleClose={handleScaleClose}
					handleOptionClick={chooseScale}
					styles={{ flex: 1, height: "48px" }}
					startIcon={<KeyboardArrowDownIcon />}
				/>
				<MusicButton
					text="Octave"
					handleClick={handleOctaveClick}
					options={octaveOptions}
					anchorEl={octaveAnchorEl}
					open={openOctaveOptions}
					handleClose={handleOctaveClose}
					handleOptionClick={chooseOctave}
					styles={{ flex: 1, height: "48px" }}
					startIcon={<KeyboardArrowDownIcon />}
				/>
			</Box>
		</>
	);
};
