import { Box, Button } from "@mui/material";
import { useState, MouseEvent, useEffect } from "react";
import MusicButton from "../music-display/MusicButton";
import {
  flatOptions,
  naturalOptions,
  octaveOptions,
  scaleOptions,
  sharpOptions,
} from "../music-display/MusicalOptions";
import { getNoteGameXml } from "../../services/MusicService";

const NoteGame = () => {
  //TODO: use effect to return the value, then immediately call another request
  //for speed!!!!!!!!!!
  const [scaleChoice, setScale] = useState<string>("C");
  const [octaveChoice, setOctaveChoice] = useState<string>("4");
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
  useEffect(() => {
    getNoteGameXml(scaleChoice, octaveChoice);
  }, [scaleChoice, octaveChoice]);
  const validateInput = (noteName: string): void => {
    console.log(noteName);
    //TODO: make the function check if they are equal, if they are not, make the
    //button red for a moment, if they are equal, make it green for a moment
    return;
  };
  return (
    <>
      <Box
        id="sheet-music-div"
        sx={{
          width: "100%",
          height: "500px",
          border: "1px dashed grey",
          alignContent: "center",
        }}
      ></Box>
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
      <Box>
        {totalOptions.map((optionList) => (
          <Box>
            {optionList.map((option) => (
              // TODO: make the buttons larger for the kids
              <Button
                key={option.value}
                variant="contained"
                sx={{ m: 1 }}
                onClick={() => validateInput(option.value)}
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

export default NoteGame;
