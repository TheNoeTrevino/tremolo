import { Box, Fade, useTheme, useMediaQuery, Typography } from "@mui/material";
import { useState, MouseEvent, useEffect, useRef, useCallback } from "react";
import { MusicService } from "../../services/MusicService";
import { noteGameProps } from "../../models/models";
import { keypressToNote, noteToSound } from "./NoteGameUtilities";
import { NoteGameMobileView } from "../../components/note-game/NoteGameMobileView";
import { NoteGameDesktopView } from "../../components/note-game/NoteGameDesktopView";
import { NoteGameViewProps } from "../../components/note-game/NoteGameViewProps";
import { useAuth } from "../../hooks/useAuth";
import {
	NoteGameService,
	NoteGameEntryRequest,
} from "../../services/NoteGameService";

const GAME_DURATION_SECONDS = 30;

const NoteGame = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const { currentUser, isAuthenticated } = useAuth();

	const [sound, setSound] = useState<string | undefined>(undefined);

	const startTime = useRef<number>(Math.floor(new Date().getTime() / 1000));
	const [currentTime, setCurrentTime] = useState<number>(
		Math.floor(new Date().getTime() / 1000),
	);
	const [gameOver, setGameOver] = useState<boolean>(false);

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

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	const useSaveNoteGame = useCallback(() => {
		return async () => {
			if (!isAuthenticated || !currentUser) {
				// TODO: Implement save for non-logged-in users
				return;
			}

			if (totalCounter === 0) {
				return;
			}

			const elapsedSeconds = currentTime - startTime.current;
			const hours = Math.floor(elapsedSeconds / 3600);
			const minutes = Math.floor((elapsedSeconds % 3600) / 60);
			const seconds = elapsedSeconds % 60;
			const timeLength = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;

			const notesPerMinute =
				elapsedSeconds > 0
					? Math.round((totalCounter / elapsedSeconds) * 60)
					: 0;

			const entry: NoteGameEntryRequest = {
				user_id: currentUser.id,
				time_length: timeLength,
				total_questions: totalCounter,
				correct_questions: correctCounter,
				notes_per_minute: notesPerMinute,
			};

			try {
				await NoteGameService.saveNoteGameEntry(entry);
				console.log("Note game entry saved successfully");
			} catch (error) {
				console.error("Failed to save note game entry:", error);
			}
		};
	}, [isAuthenticated, currentUser, totalCounter, correctCounter, currentTime]);

	const saveGame = useSaveNoteGame();

	useEffect(() => {
		const timer = setInterval(() => {
			const now = Math.floor(new Date().getTime() / 1000);
			setCurrentTime(now);

			const elapsed = now - startTime.current;
			if (elapsed >= GAME_DURATION_SECONDS && !gameOver) {
				setGameOver(true);
				saveGame();
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [gameOver, saveGame]);

	const fetchNote = useCallback(async (): Promise<void> => {
		if (!gameOver) {
			setNoteInformation(
				await MusicService.getNoteGameXml(scaleChoice, octaveChoice),
			);
		}
	}, [scaleChoice, octaveChoice, gameOver]);

	useEffect(() => {
		fetchNote();
	}, [scaleChoice, octaveChoice, totalCounter, fetchNote]);

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
		if (gameOver) return;

		setTotalcounter(totalCounter + 1);
		if (noteKey != noteInformation?.noteName) {
			return;
		}

		setCorrectCounter(correctCounter + 1);
		const audio = new Audio(sound);
		audio.play();
	};

	const validateKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
		if (gameOver) return;

		setTotalcounter(totalCounter + 1);
		if (keypressToNote[event.key] != noteInformation?.noteName) {
			return;
		}

		setCorrectCounter(correctCounter + 1);
		const audio = new Audio(sound);
		audio.play();
	};

	const resetGame = () => {
		setGameOver(false);
		setTotalcounter(0);
		setCorrectCounter(0);
		startTime.current = Math.floor(new Date().getTime() / 1000);
		setCurrentTime(startTime.current);
		fetchNote();
	};

	const commonProps: NoteGameViewProps = {
		correctCounter,
		totalCounter,
		currentTime,
		startTime: startTime.current,
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
		onAnswer: validateButtonClick,
	};

	const timeRemaining = Math.max(
		0,
		GAME_DURATION_SECONDS - (currentTime - startTime.current),
	);

	if (gameOver) {
		const accuracy =
			totalCounter > 0 ? Math.round((correctCounter / totalCounter) * 100) : 0;
		const npm =
			currentTime - startTime.current > 0
				? Math.round((totalCounter / (currentTime - startTime.current)) * 60)
				: 0;

		// TODO: extract this into its own component
		return (
			<Fade in={true} timeout={500}>
				<Box
					my={isMobile ? "0" : "2rem"}
					sx={{
						// TODO: we are reusing these styles extacty, extract to the NoeGameStyles.tsx file
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						paddingBottom: isMobile ? "140px" : "0",
						gap: 2,
					}}
				>
					<Typography variant="h4">Game Over!</Typography>
					<Typography variant="h6">
						Accuracy: {accuracy}% ({correctCounter}/{totalCounter})
					</Typography>
					<Typography variant="h6">Notes Per Minute: {npm}</Typography>
					<button
						onClick={resetGame}
						style={{
							padding: "10px 20px",
							fontSize: "16px",
							cursor: "pointer",
						}}
					>
						Play Again
					</button>
				</Box>
			</Fade>
		);
	}

	return (
		<div onKeyDown={validateKeyDown} tabIndex={0}>
			<Fade in={true} timeout={500}>
				<Box
					my={isMobile ? "0" : "2rem"}
					sx={{
						// TODO: use the new extracted styles from NoteGameStyles.tsx here
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						paddingBottom: isMobile ? "140px" : "0",
					}}
				>
					<Typography variant="h5" sx={{ mb: 2 }}>
						Time Remaining: {formatTime(timeRemaining)}
					</Typography>
					{isMobile ? (
						<NoteGameMobileView {...commonProps} />
					) : (
						<NoteGameDesktopView {...commonProps} />
					)}
				</Box>
			</Fade>
		</div>
	);
};

export default NoteGame;
