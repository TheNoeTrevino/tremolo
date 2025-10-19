import {
	Box,
	Button,
	ButtonBase,
	Card,
	Fade,
	Typography,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { useState, MouseEvent, useEffect, useRef } from "react";
import { MusicService } from "../../services/MusicService";
import { noteGameStyles } from "./NoteGameStyles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { noteGameProps } from "../../models/models";
import { keypressToNote, noteToSound } from "./NoteGameUtilities";
import {
	sharpOptions,
	naturalOptions,
	flatOptions,
	scaleOptions,
	octaveOptions,
} from "../../components/musical/MusicalOptions";
import MusicButton from "../../components/musical/MusicButton";

const NoteGame = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));

	const [sound, setSound] = useState<string | undefined>(undefined);

	const startTime = useRef<number>(Math.floor(new Date().getTime() / 1000));
	const currentTime = Math.floor(new Date().getTime() / 1000);

	const [totalCounter, setTotalcounter] = useState<number>(0);
	const [correctCounter, setCorrectCounter] = useState<number>(0);

	const [scaleChoice, setScale] = useState<string>("C");
	const [octaveChoice, setOctaveChoice] = useState<string>("4");

	const [noteInformation, setNoteInformation] = useState<
		noteGameProps | undefined
	>(undefined);

	const [scaleAnchorEl, setScaleAnchorEl] = useState<null | HTMLElement>(null);
	const [octaveAnchorEl, setOctaveAnchorEl] = useState<null | HTMLElement>(
		null,
	);

	const handleScaleClick = (event: MouseEvent<HTMLElement>) => {
		setScaleAnchorEl(event.currentTarget);
	};
	const handleOctaveClick = (event: MouseEvent<HTMLElement>) => {
		setOctaveAnchorEl(event.currentTarget);
	};
	const handleScaleClose = () => {
		setScaleAnchorEl(null);
	};
	const handleOctaveClose = () => {
		setOctaveAnchorEl(null);
	};
	const chooseScale = (scaleChoice: string) => {
		setScale(scaleChoice);
	};
	const chooseOctave = (octaveChoice: string) => {
		setOctaveChoice(octaveChoice);
	};

	const openScaleOptions = Boolean(scaleAnchorEl);
	const openOctaveOptions = Boolean(octaveAnchorEl);
	const totalOptions = [sharpOptions, naturalOptions, flatOptions];

	async function fetchNote(): Promise<void> {
		setNoteInformation(
			await MusicService.getNoteGameXml(scaleChoice, octaveChoice),
		);
	}

	// FIX: this is getting ran twice
	useEffect(() => {
		fetchNote();
	}, [scaleChoice, octaveChoice, totalCounter]);

	useEffect(() => {
		if (!noteInformation) {
			console.log("note information not yet fetch");
		} else {
			console.log(noteInformation?.fullNoteName);
			const newSound = noteToSound[noteInformation.fullNoteName];
			setSound(newSound);
		}
	}, [noteInformation]);

	const validateButtonClick = (noteKey: string): void => {
		setTotalcounter(totalCounter + 1);
		if (noteKey != noteInformation?.noteName) {
			return;
		}

		setCorrectCounter(correctCounter + 1);
		const audio = new Audio(sound);
		audio.play();
	};

	const validateKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		setTotalcounter(totalCounter + 1);
		if (keypressToNote[event.key] != noteInformation?.noteName) {
			return;
		}

		setCorrectCounter(correctCounter + 1);
		const audio = new Audio(sound);
		audio.play();
	};

	return (
		<div onKeyDown={validateKeyDown} tabIndex={0}>
			<Fade in={true} timeout={500}>
				<Box
					my={isMobile ? "0" : "2rem"}
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						paddingBottom: isMobile ? "140px" : "0",
					}}
				>
					{/* NOTE: just use different layouts for mobile and desktop for simplicity */}
					{isMobile ? (
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
											{Math.floor(
												(totalCounter / (currentTime - startTime.current)) *
													100,
											)}
										</Typography>
									</>
								)}
							</Box>

							<Card sx={noteGameStyles.mobileMusicContainer} elevation={6}>
								<Box
									id="sheet-music-div"
									sx={noteGameStyles.mobileMusicDisplay}
								></Box>
							</Card>

							<Box sx={noteGameStyles.mobileAnswerButtonsContainer}>
								{totalOptions.map((optionList, index) => (
									<Box key={index} sx={noteGameStyles.mobileButtonRow}>
										{optionList.map((option) => (
											<Button
												key={option.value}
												variant="contained"
												sx={noteGameStyles.mobileAnswerButton}
												onClick={() => validateButtonClick(option.value)}
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
					) : (
						// Desktop Layout
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
											<Typography m={"1rem"}>
												Answer to start a session!
											</Typography>
										</Card>
									) : (
										<Box sx={noteGameStyles.scoreboardContainer}>
											<Card sx={noteGameStyles.scoreboardItems} elevation={3}>
												<Typography m={"1rem"}>
													Accuracy
													{correctCounter / totalCounter === 1
														? ": 100%"
														: `: ${Math.round((correctCounter / totalCounter) * 100)}%`}
												</Typography>
											</Card>
											<Card sx={noteGameStyles.scoreboardItems} elevation={3}>
												<Typography m={"1rem"}>
													Fraction: {correctCounter}/{totalCounter}
												</Typography>
											</Card>
											<Card sx={noteGameStyles.scoreboardItems} elevation={3}>
												<Typography m={"1rem"}>
													{`NPM:
                          ${Math.floor(
														(totalCounter / (currentTime - startTime.current)) *
															100,
													)}`}
												</Typography>
											</Card>
										</Box>
									)}
								</ButtonBase>
								<Card sx={noteGameStyles.musicContainer} elevation={6}>
									<Box
										id="sheet-music-div"
										sx={noteGameStyles.musicDisplay}
									></Box>
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
									<Box key={index} width={"100%"}>
										{optionList.map((option) => (
											<Button
												key={option.value}
												variant="contained"
												sx={{ ...noteGameStyles.answerButtons }}
												onClick={() => validateButtonClick(option.value)}
											>
												{option.name}
											</Button>
										))}
									</Box>
								))}
							</Box>
						</>
					)}
				</Box>
			</Fade>
		</div>
	);
};

export default NoteGame;
