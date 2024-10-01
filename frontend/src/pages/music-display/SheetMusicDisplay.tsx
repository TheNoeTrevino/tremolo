import { Box, Button, Typography } from "@mui/material";
import { getMaryMusic, getRhythmMusic } from "../../services/MusicService";
import { useState, MouseEvent } from "react";
import MusicButton from "./MusicButton";
import {
  eightOptions,
  octaveOptions,
  scaleOptions,
  sixteenthOptions,
} from "./MusicalOptions";

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

  // TODO: add these rythms choices to a list, and display that list on a page
  // NOTE: for now, we are just sending back a measure of the same one
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

  return (
    <>
      {isVisible && (
        <Box
          id="sheet-music-div"
          sx={{ width: "100%", height: "500px", border: "1px solid grey" }}
        ></Box>
      )}

      {!isVisible && (
        <Box
          sx={{
            width: "100%",
            height: "500px",
            border: "1px dashed grey",
            alignContent: "center",
          }}
        >
          <Typography variant="h6" textAlign="center">
            Click the button below to open the sheet music
          </Typography>
        </Box>
      )}

      <Button
        sx={{
          mt: 2,
          position: "relative",
          left: "50%",
          // NOTE: without this it centers based of the left edge,
          // this centers it pased off the middle
          transform: "translateX(-50%)",
        }}
        variant="contained"
        onClick={() => {
          if (rhythmChoice && rhythmType) {
            // TODO: if they entered rhythms, then call the rhythm function
            getRhythmMusic({
              scale: scaleChoice,
              octave: octaveChoice,
              rhythm: rhythmChoice,
              rhythmType: rhythmType,
            });
          } else {
            getMaryMusic({ scale: scaleChoice, octave: octaveChoice });
          }
          setVisibility(true);
        }}
      >
        Open Sheet Music
      </Button>

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
    </>
  );
};

export default SheetMusicDisplay;
