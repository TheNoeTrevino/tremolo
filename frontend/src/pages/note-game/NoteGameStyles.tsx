import { SxProps } from "@mui/system";

const noteGameStyles: Record<string, SxProps> = {
  scoreboardContainer: {
    mb: "2rem",
    display: "flex",
    justifyContent: "space-evenly",
    gap: 3,
  },

  scoreboardItems: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  mainDiv: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    mb: "2rem",
  },

  musicDisplay: {
    display: "flex",
    width: "66%",
    height: "20rem",
    alignItems: "center",
  },

  optionButtonsCard: {
    display: "flex",
    flexDirection: "column",
    height: "20rem",
    justifyContent: "center",
    alignItems: "center",
  },

  optionButtonsContainer: {
    display: "flex",
    flexDirection: "column",
    mx: "1rem",
  },

  answerButtons: {
    m: "1rem",
    textTransform: "none",
    width: "9rem",
    height: "3rem",
  },
};

export { noteGameStyles };
