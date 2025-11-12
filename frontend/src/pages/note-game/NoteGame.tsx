import {
	Box,
	Fade,
	useTheme,
	useMediaQuery,
	Typography,
	Button,
	ButtonGroup,
	Paper,
} from "@mui/material";
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

type GameMode = "time" | "notes";

const TIME_OPTIONS = [15, 30, 60, 120];
const NOTE_OPTIONS = [10, 25, 50, 100];

const NoteGame = () => {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const { currentUser, isAuthenticated } = useAuth();

	const [sound, setSound] = useState<string | undefined>(undefined);

	// Game mode and settings
	const [gameMode, setGameMode] = useState<GameMode>("time");
	const [timeLimit, setTimeLimit] = useState<number>(30);
	const [noteLimit, setNoteLimit] = useState<number>(25);
	const [gameStarted, setGameStarted] = useState<boolean>(false);

	const startTime = useRef<number | null>(null);
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
		// Note will be refetched via useEffect when scaleChoice changes
		resetGame();
	};
	const chooseOctave = (octaveChoice: string) => {
		setOctaveChoice(octaveChoice);
		// Note will be refetched via useEffect when octaveChoice changes
		resetGame();
	};

	const openScaleOptions = Boolean(scaleAnchorEl);
	const openOctaveOptions = Boolean(octaveAnchorEl);

	const formatTime = (seconds: number): string => {
		const mins = Math.floor(seconds / 60);
		const secs = seconds % 60;
		return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
	};

	// Handler for changing game mode - does NOT reset game
	const handleGameModeChange = (mode: GameMode) => {
		if (mode === gameMode) return;
		setGameMode(mode);
		setGameStarted(false);
		setGameOver(false);
		setTotalcounter(0);
		setCorrectCounter(0);
		startTime.current = null;
	};

	// Handler for changing time limit - does NOT reset game
	const handleTimeLimitChange = (time: number) => {
		if (time === timeLimit) return;
		setTimeLimit(time);
		setGameStarted(false);
		setGameOver(false);
		setTotalcounter(0);
		setCorrectCounter(0);
		startTime.current = null;
	};

	// Handler for changing note limit - does NOT reset game
	const handleNoteLimitChange = (notes: number) => {
		if (notes === noteLimit) return;
		setNoteLimit(notes);
		setGameStarted(false);
		setGameOver(false);
		setTotalcounter(0);
		setCorrectCounter(0);
		startTime.current = null;
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

			const elapsedSeconds =
				startTime.current !== null ? currentTime - startTime.current : 0;
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
		if (!gameStarted || gameOver || startTime.current === null) return;

		const timer = setInterval(() => {
			const now = Math.floor(new Date().getTime() / 1000);
			setCurrentTime(now);

			if (gameMode === "time") {
				const elapsed = now - startTime.current!;
				if (elapsed >= timeLimit) {
					setGameOver(true);
					saveGame();
				}
			} else if (gameMode === "notes") {
				if (totalCounter >= noteLimit) {
					setGameOver(true);
					saveGame();
				}
			}
		}, 1000);

		return () => clearInterval(timer);
	}, [
		gameStarted,
		gameOver,
		gameMode,
		timeLimit,
		noteLimit,
		totalCounter,
		saveGame,
	]);

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

		// Start game on first note entry
		if (!gameStarted) {
			setGameStarted(true);
			startTime.current = Math.floor(new Date().getTime() / 1000);
		}

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

		// Start game on first note entry
		if (!gameStarted) {
			setGameStarted(true);
			startTime.current = Math.floor(new Date().getTime() / 1000);
		}

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
		setGameStarted(false);
		setTotalcounter(0);
		setCorrectCounter(0);
		startTime.current = null;
		setCurrentTime(Math.floor(new Date().getTime() / 1000));
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

	const timeRemaining =
		gameMode === "time" && startTime.current !== null
			? Math.max(0, timeLimit - (currentTime - startTime.current))
			: 0;

	// Top bar with game options (always visible)
	const renderTopBar = () => (
		<Box
			sx={{
				display: "flex",
				justifyContent: "center",
				alignItems: "center",
				gap: 2,
				mb: 3,
				flexWrap: "wrap",
			}}
		>
			{/* Game Mode Buttons */}
			<ButtonGroup size="small">
				<Button
					variant={gameMode === "time" ? "contained" : "outlined"}
					onClick={() => handleGameModeChange("time")}
					disabled={gameStarted && !gameOver}
				>
					time
				</Button>
				<Button
					variant={gameMode === "notes" ? "contained" : "outlined"}
					onClick={() => handleGameModeChange("notes")}
					disabled={gameStarted && !gameOver}
				>
					notes
				</Button>
			</ButtonGroup>

			{/* Time/Note Limit Options */}
			{gameMode === "time" ? (
				<ButtonGroup size="small">
					{TIME_OPTIONS.map((time) => (
						<Button
							key={time}
							variant={timeLimit === time ? "contained" : "outlined"}
							onClick={() => handleTimeLimitChange(time)}
							disabled={gameStarted && !gameOver}
						>
							{time}
						</Button>
					))}
				</ButtonGroup>
			) : (
				<ButtonGroup size="small">
					{NOTE_OPTIONS.map((notes) => (
						<Button
							key={notes}
							variant={noteLimit === notes ? "contained" : "outlined"}
							onClick={() => handleNoteLimitChange(notes)}
							disabled={gameStarted && !gameOver}
						>
							{notes}
						</Button>
					))}
				</ButtonGroup>
			)}
		</Box>
	);

	if (gameOver) {
		const accuracy =
			totalCounter > 0 ? Math.round((correctCounter / totalCounter) * 100) : 0;
		const elapsedTime =
			startTime.current !== null ? currentTime - startTime.current : 0;
		const npm =
			elapsedTime > 0 ? Math.round((totalCounter / elapsedTime) * 60) : 0;

		// TODO: extract this into its own component
		return (
			<Fade in={true} timeout={500}>
				<Box
					my={isMobile ? "0" : "2rem"}
					sx={{
						// TODO: we are reusing these styles exactly, extract to the NoteGameStyles.tsx file
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						flexDirection: "column",
						paddingBottom: isMobile ? "140px" : "0",
						gap: 2,
					}}
				>
					{renderTopBar()}
					<Typography variant="h4">Game Over!</Typography>
					<Typography variant="h6">
						Accuracy: {accuracy}% ({correctCounter}/{totalCounter})
					</Typography>
					<Typography variant="h6">Notes Per Minute: {npm}</Typography>
					<Button
						variant="contained"
						onClick={resetGame}
						sx={{
							padding: "10px 20px",
							fontSize: "16px",
						}}
					>
						Play Again
					</Button>
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
					{renderTopBar()}

					{/* Display based on game mode */}
					{gameMode === "time" ? (
						<Typography variant="h5" sx={{ mb: 2 }}>
							{gameStarted
								? `Time Remaining: ${formatTime(timeRemaining)}`
								: `Time: ${timeLimit}s`}
						</Typography>
					) : (
						<Typography variant="h5" sx={{ mb: 2 }}>
							Notes: {totalCounter} / {noteLimit}
						</Typography>
					)}
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
