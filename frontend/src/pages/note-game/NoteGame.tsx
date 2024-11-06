import { Box, Button, Card, Fade, Typography } from "@mui/material";
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
import { noteGameStyles } from "./NoteGameStyles";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

// TODO: add conditional colors to the answer choice answerButtons
// add the Notes per minute calculation
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

  const openScaleOptions = Boolean(scaleAnchorEl);
  const openOctaveOptions = Boolean(octaveAnchorEl);
  const totalOptions = [sharpOptions, naturalOptions, flatOptions];

  async function fetchNote(): Promise<void> {
    setNoteName(await MusicService.getNoteGameXml(scaleChoice, octaveChoice));
  }

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
    setCorrectCounter(correctCounter + 1);
    alert("true");
  };

  return (
    <>
      <Fade in={true}>
        <Box
          my={"2rem"}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
          }}
        >
          <Box id="main" sx={noteGameStyles.mainDiv}>
            <Card elevation={6} sx={noteGameStyles.optionButtonsCard}>
              {isNaN(correctCounter / totalCounter) ? (
                <Card sx={noteGameStyles.scoreboardContainer}>
                  <Typography m={"1rem"}>
                    Answer the current question to start a session!
                  </Typography>
                </Card>
              ) : (
                <Box sx={noteGameStyles.scoreboardContainer}>
                  <Card sx={noteGameStyles.scoreboardItems}>
                    <Typography m={"1rem"}>
                      Accurracy
                      {correctCounter / totalCounter === 1
                        ? ": 100%"
                        : `: ${Math.round((correctCounter / totalCounter) * 100)}%`}
                    </Typography>
                  </Card>
                  <Card sx={noteGameStyles.scoreboardItems}>
                    <Typography m={"1rem"}>
                      Fraction: {correctCounter}/{totalCounter}
                    </Typography>
                  </Card>
                  <Card sx={noteGameStyles.scoreboardItems}>
                    <Typography m={"1rem"}>NPM: </Typography>
                  </Card>
                </Box>
              )}
            </Card>
            <Card
              id="sheet-music-div"
              elevation={6}
              sx={noteGameStyles.musicDisplay}
            />
            <Card elevation={6} sx={noteGameStyles.optionButtonsCard}>
              <Box sx={noteGameStyles.optionButtonsContainer}>
                {/* make the music button take in a possible icon for the end icon */}
                <MusicButton
                  text="Choose Scale"
                  handleClick={handleScaleClick}
                  options={scaleOptions}
                  anchorEl={scaleAnchorEl}
                  open={openScaleOptions}
                  handleClose={handleScaleClose}
                  handleOptionClick={chooseScale}
                  styles={musicButtonStyles}
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
                  styles={musicButtonStyles}
                  startIcon={<KeyboardArrowDownIcon />}
                />
              </Box>
            </Card>
          </Box>
          <Box id="options">
            {totalOptions.map((optionList) => (
              <Box width={"100%"}>
                {optionList.map((option) => (
                  <Button
                    key={option.value}
                    variant="contained"
                    sx={{ ...noteGameStyles.answerButtons }}
                    onClick={() => validateInput(option.value)}
                  >
                    {option.name}
                  </Button>
                ))}
              </Box>
            ))}
          </Box>
        </Box>
      </Fade>
    </>
  );
};

export default NoteGame;
