import {
	Box,
	Fade,
	useTheme,
	useMediaQuery,
} from "@mui/material";
import { useState, MouseEvent, useEffect, useRef, useCallback } from "react";
import { MusicService } from "../../services/MusicService";
import { noteGameProps } from "../../models/models";
import { keypressToNote, noteToSound } from "./NoteGameUtilities";
import { NoteGameMobileView } from "../../components/note-game/NoteGameMobileView";
import { NoteGameDesktopView } from "../../components/note-game/NoteGameDesktopView";
import { NoteGameViewProps } from "../../components/note-game/NoteGameViewProps";

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

	const fetchNote = useCallback(async (): Promise<void> => {
		setNoteInformation(
			await MusicService.getNoteGameXml(scaleChoice, octaveChoice),
		);
	}, [scaleChoice, octaveChoice]);

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
