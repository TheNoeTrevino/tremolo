import { Box, Button, ButtonBase, Card, Fade, Typography } from "@mui/material";
import useSound from "use-sound";
import { useState, MouseEvent, useEffect, useRef } from "react";
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
import { noteGameProps } from "../../models/models";
import { noteToSound } from "./NoteGameUtilities";

const NoteGame = () => {
  // use ref keeps the value for the lifecyle of the component, nice
  const startTime = useRef<number>(Math.floor(new Date().getTime() / 1000));
  const currentTime = Math.floor(new Date().getTime() / 1000);
  const [totalCounter, setTotalcounter] = useState<number>(0);
  const [correctCounter, setCorrectCounter] = useState<number>(0);

  const [scaleChoice, setScale] = useState<string>("C");
  const [octaveChoice, setOctaveChoice] = useState<string>("4");

  const [noteInformation, setNoteInformation] = useState<
    noteGameProps | undefined
  >(undefined);

  const [sound, setSound] = useState<string>("c");
  const [playSound] = useSound(sound);

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

  useEffect(() => {
    fetchNote();
  }, [scaleChoice, octaveChoice, totalCounter]);

  // since we wait for the previous one to finsish, this will not be undefined
  useEffect(() => {
    if (!noteInformation) {
      console.log("note information not yet fetch");
    } else {
      console.log(noteInformation?.fullNoteName);
      const newSound = noteToSound[noteInformation.fullNoteName];
      setSound(newSound);
    }
  }, [noteInformation]);

  const validateInput = (noteKey: string): void => {
    setTotalcounter(totalCounter + 1);
    if (noteKey != noteInformation?.noteName) {
      return;
    }

    setCorrectCounter(correctCounter + 1);
    playSound();
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
            <ButtonBase
              centerRipple={true}
              component={Card}
              elevation={6}
              sx={noteGameStyles.optionButtonsCard}
            >
              {isNaN(correctCounter / totalCounter) ? (
                <Card sx={noteGameStyles.scoreboardContainer} elevation={3}>
                  <Typography m={"1rem"}>Answer to start a session!</Typography>
                </Card>
              ) : (
                <Box sx={noteGameStyles.scoreboardContainer}>
                  <Card sx={noteGameStyles.scoreboardItems} elevation={3}>
                    <Typography m={"1rem"}>
                      Accurracy
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
