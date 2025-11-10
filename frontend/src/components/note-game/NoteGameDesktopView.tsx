import { Box, Card, Typography, ButtonBase, Button } from "@mui/material";
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

export const NoteGameDesktopView = ({
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
			<Box id="main" sx={noteGameStyles.mainDiv}>
				<ButtonBase
					centerRipple={true}
					component={Card}
					elevation={6}
					sx={noteGameStyles.optionButtonsCard}
				>
					{isNaN(correctCounter / totalCounter) ? (
						<Card sx={noteGameStyles.scoreboardContainer} elevation={3}>
							<Typography m="1rem">Answer to start a session!</Typography>
						</Card>
					) : (
						<Card sx={noteGameStyles.scoreboardContainer}>
							<Card sx={noteGameStyles.scoreboardItems} elevation={3}>
								<Typography m="1rem">
									Accuracy
									{correctCounter / totalCounter === 1
										? ": 100%"
										: `: ${Math.round((correctCounter / totalCounter) * 100)}%`}
								</Typography>
							</Card>
							<Card sx={noteGameStyles.scoreboardItems} elevation={3}>
								<Typography m="1rem">
									Fraction: {correctCounter}/{totalCounter}
								</Typography>
							</Card>
							<Card sx={noteGameStyles.scoreboardItems} elevation={3}>
								<Typography m="1rem">
									{`NPM:
                          ${Math.floor(
														(totalCounter / (currentTime - startTime)) * 100,
													)}`}
								</Typography>
							</Card>
						</Card>
					)}
				</ButtonBase>
				<Card sx={noteGameStyles.musicContainer} elevation={6}>
					<Box id="sheet-music-div" sx={noteGameStyles.musicDisplay}></Box>
				</Card>
				<Card elevation={6} sx={noteGameStyles.optionButtonsCard}>
					<Box sx={noteGameStyles.optionButtonsContainer}>
						<MusicButton
							text="Choose Scale"
							handleClick={handleScaleClick}
							options={scaleOptions}
							anchorEl={scaleAnchorEl}
							open={openScaleOptions}
							handleClose={handleScaleClose}
							handleOptionClick={chooseScale}
							styles={{ mt: 2, width: "100%" }}
							startIcon={<KeyboardArrowDownIcon />}
						/>
						<MusicButton
							text="Choose Octave"
							handleClick={handleOctaveClick}
							options={octaveOptions}
							anchorEl={octaveAnchorEl}
							open={openOctaveOptions}
							handleClose={handleOctaveClose}
							handleOptionClick={chooseOctave}
							styles={{ mt: 2, width: "100%" }}
							startIcon={<KeyboardArrowDownIcon />}
						/>
					</Box>
				</Card>
			</Box>
			<Box id="options">
				{totalOptions.map((optionList, index) => (
					<Box key={index} width="100%">
						{optionList.map((option) => (
							<Button
								key={option.value}
								variant="contained"
								sx={{ ...noteGameStyles.answerButtons }}
								onClick={() => onAnswer(option.value)}
							>
								{option.name}
							</Button>
						))}
					</Box>
				))}
			</Box>
		</>
	);
};
