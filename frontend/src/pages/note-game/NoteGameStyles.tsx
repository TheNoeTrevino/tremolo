import { SxProps } from "@mui/system";

const noteGameStyles: Record<string, SxProps> = {
  scoreboardContainer: {
    mb: "2rem",
    display: "flex",
    flexDirection: "column",
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
    gap: "2rem",
    px: "2rem",
    mb: "2rem",
  },

  musicContainer: {
    flex: "2",
    display: "flex",
    width: "50%",
    height: "50%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "10px",
  },

  musicDisplay: {
    width: "50%",
    height: "20rem",
    justifyItems: "center",
    alignItems: "center",
    pl: "2rem",
  },

  optionButtonsCard: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    height: "20rem",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
  },

  optionButtonsContainer: {
    display: "flex",
    flexDirection: "column",
  },

  answerButtons: {
    m: "1rem",
    textTransform: "none",
    width: "9rem",
    height: "3rem",
  },
};

export { noteGameStyles };
