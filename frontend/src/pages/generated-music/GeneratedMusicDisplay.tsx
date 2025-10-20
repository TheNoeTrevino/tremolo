import { Box, Card, Fade, Typography } from "@mui/material";
import { MusicService } from "../../services/MusicService";
import { useState, MouseEvent, useEffect } from "react";
import MusicButton from "../../components/musical/MusicButton";
import {
	eightOptions,
	octaveOptions,
	scaleOptions,
	sixteenthOptions,
} from "../../components/musical/MusicalOptions";
import { generatedMusicStyles } from "../../styles";

const SheetMusicDisplay = () => {
	const [scaleChoice, setScale] = useState<string>("C");
	const [octaveChoice, setOctaveChoice] = useState<string>("4");
	const [rhythmChoice, setRhythmChoice] = useState<string | null>(null);
	const [rhythmType, setRhythmType] = useState<number | null>(null);
	const [isVisible, setVisibility] = useState<boolean>(false);

	const [scaleAnchorEl, setScaleAnchorEl] = useState<null | HTMLElement>(null);
	const [octaveAnchorEl, setOctaveAnchorEl] = useState<null | HTMLElement>(
		null,
	);
	const [rhythm16thAnchorEl, set16thRhythmAnchorEl] =
		useState<null | HTMLElement>(null);
	const [rhythm8thAnchorEl, set8thRhythmAnchorEl] =
		useState<null | HTMLElement>(null);

	const chooseScale = (scaleChoice: string) => {
		setScale(scaleChoice);
	};

	const chooseOctave = (octaveChoice: string) => {
		setOctaveChoice(octaveChoice);
	};

	const choose16thRhythm = (rhythmChoice: string) => {
		setRhythmChoice(rhythmChoice);
		setRhythmType(16);
	};

	const choose8thRhythm = (rhythmChoice: string) => {
		setRhythmChoice(rhythmChoice);
		setRhythmType(8);
	};

	const openScaleOptions = Boolean(scaleAnchorEl);
	const openOctaveOptions = Boolean(octaveAnchorEl);
	const open16thRhythmOptions = Boolean(rhythm16thAnchorEl);
	const open8thRhythmOptions = Boolean(rhythm8thAnchorEl);
	const handleScaleClick = (event: MouseEvent<HTMLElement>) => {
		setScaleAnchorEl(event.currentTarget);
	};
	const handleOctaveClick = (event: MouseEvent<HTMLElement>) => {
		setOctaveAnchorEl(event.currentTarget);
	};
	const handle16thRhythmClick = (event: MouseEvent<HTMLElement>) => {
		set16thRhythmAnchorEl(event.currentTarget);
	};
	const handle8thRhythmClick = (event: MouseEvent<HTMLElement>) => {
		set8thRhythmAnchorEl(event.currentTarget);
	};

	const handleScaleClose = () => {
		setScaleAnchorEl(null);
	};
	const handleOctaveClose = () => {
		setOctaveAnchorEl(null);
	};
	const handle16thRhythmClose = () => {
		set16thRhythmAnchorEl(null);
	};
	const handle8thRhythmClose = () => {
		set8thRhythmAnchorEl(null);
	};

	useEffect(() => {
		setVisibility(false);
		if (rhythmChoice && rhythmType) {
			MusicService.getRhythmMusic({
				scale: scaleChoice,
				octave: octaveChoice,
				rhythm: rhythmChoice,
				rhythmType: rhythmType,
			});
		} else {
			MusicService.getMaryMusic({
				scale: scaleChoice,
				octave: octaveChoice,
			});
		}
		setVisibility(true);
	}, [scaleChoice, octaveChoice, rhythmChoice, rhythmType]);

	return (
		<>
			<Fade in={true} timeout={500}>
				<Box>
					<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
						<Box sx={generatedMusicStyles.sheetMusicContainer}>
							<Card
								id="sheet-music-div"
								elevation={6}
								sx={generatedMusicStyles.sheetMusic}
							>
								{!isVisible && (
									<Typography variant="h6" textAlign="center">
										Rendering sheet music, pleasse wait...
									</Typography>
								)}
							</Card>
						</Box>
					</Box>

					<Box sx={generatedMusicStyles.musicButtonDiv}>
						<MusicButton
							text="Choose Scale"
							handleClick={handleScaleClick}
							options={scaleOptions}
							anchorEl={scaleAnchorEl}
							open={openScaleOptions}
							handleClose={handleScaleClose}
							handleOptionClick={chooseScale}
						/>
						<MusicButton
							text="Choose Octave"
							handleClick={handleOctaveClick}
							options={octaveOptions}
							anchorEl={octaveAnchorEl}
							open={openOctaveOptions}
							handleClose={handleOctaveClose}
							handleOptionClick={chooseOctave}
						/>
						<MusicButton
							text="16th Note Rhythms"
							handleClick={handle16thRhythmClick}
							options={sixteenthOptions}
							anchorEl={rhythm16thAnchorEl}
							open={open16thRhythmOptions}
							handleClose={handle16thRhythmClose}
							handleOptionClick={choose16thRhythm}
						/>
						<MusicButton
							text="8th Note Rhythms"
							handleClick={handle8thRhythmClick}
							options={eightOptions}
							anchorEl={rhythm8thAnchorEl}
							open={open8thRhythmOptions}
							handleClose={handle8thRhythmClose}
							handleOptionClick={choose8thRhythm}
						/>
					</Box>
				</Box>
			</Fade>
		</>
	);
};

export default SheetMusicDisplay;
