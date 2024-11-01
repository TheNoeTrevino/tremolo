import { Box, Button, Card } from "@mui/material";
import { useState, MouseEvent, useEffect } from "react";
import MusicButton from "../music-display/MusicButton";
import {
  flatOptions,
  naturalOptions,
  octaveOptions,
  scaleOptions,
  sharpOptions,
} from "../music-display/MusicalOptions";
import { MusicService } from "../../services/MusicService";
import { musicButtonStyles } from "../../styles";

// TODO: update the score everytime the user inputs something, use in useEffect
// dependency
const NoteGame = () => {
  const [totalCounter, setTotalcounter] = useState<number>(0);
  const [correctCounter, setCorrectCounter] = useState<number>(0);
  const [incorrectCounter, setIncorrectCounter] = useState<number>(0);
  const [scaleChoice, setScale] = useState<string>("C");
  const [octaveChoice, setOctaveChoice] = useState<string>("4");
  const [noteName, setNoteName] = useState<string>("C");

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
  async function fetchNote(): Promise<void> {
    setNoteName(await MusicService.getNoteGameXml(scaleChoice, octaveChoice));
  }
  const openScaleOptions = Boolean(scaleAnchorEl);
  const openOctaveOptions = Boolean(octaveAnchorEl);
  const totalOptions = [sharpOptions, naturalOptions, flatOptions];
  useEffect(() => {
    fetchNote();
  }, [scaleChoice, octaveChoice, totalCounter]);

  const validateInput = (noteKey: string): void => {
    setTotalcounter(totalCounter + 1);
    if (noteKey != noteName) {
      setIncorrectCounter(correctCounter + 1);
      alert("false");
      return;
    }
    //TODO: make the function check if they are equal, if they are not, make the
    //button red for a moment, if they are equal, make it green for a moment
    setCorrectCounter(correctCounter + 1);
    alert("true");
  };

  return (
    <>
      <Box
        my={"2rem"}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
        }}
      >
        <Card
          elevation={4}
          sx={{
            width: "33%",
            height: "2rem",
            textAlign: "center",
            textJustify: "center",
            mb: "2rem",
          }}
        >
          {correctCounter / totalCounter} %
        </Card>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
          }}
        >
          <Card
            id="sheet-music-div"
            elevation={6}
            sx={{
              display: "flex",
              width: "66%",
              height: "20rem",
              alignItems: "center",
              mb: "2rem",
            }}
          ></Card>
          <Card
            elevation={6}
            sx={{
              display: "flex",
              flexDirection: "column",
              height: "20rem",
              justifyContent: "center",
            }}
          >
            <Box>
              <MusicButton
                text="Choose Scale"
                handleClick={handleScaleClick}
                options={scaleOptions}
                anchorEl={scaleAnchorEl}
                open={openScaleOptions}
                handleClose={handleScaleClose}
                handleOptionClick={chooseScale}
                styles={musicButtonStyles}
              />
              <MusicButton
                text="Choose Octave"
                handleClick={handleOctaveClick}
                options={octaveOptions}
                anchorEl={octaveAnchorEl}
                open={openOctaveOptions}
                handleClose={handleOctaveClose}
                handleOptionClick={chooseOctave}
                styles={musicButtonStyles}
              />
            </Box>
          </Card>
        </Box>
        <Box>
          {totalOptions.map((optionList) => (
            <Box>
              {optionList.map((option) => (
                // TODO: make the buttons larger for the kids
                <Button
                  key={option.value}
                  variant="contained"
                  sx={{ m: 1, textTransform: "none" }}
                  onClick={() => validateInput(option.value)}
                >
                  {option.name}
                </Button>
              ))}
            </Box>
          ))}
        </Box>
      </Box>
    </>
  );
};

export default NoteGame;
