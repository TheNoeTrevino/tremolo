import { SxProps } from "@mui/material";

const navbarStyles: Record<string, SxProps> = {
  musicNoteIcon: {
    display: { xs: "none", md: "flex" },
    mr: 1,
  },
  smdTypography: {
    mr: 2,
    display: { xs: "none", md: "flex" },
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    color: "inherit",
    textDecoration: "none",
  },
  menuIconButton: {
    flexGrow: 1,
    display: { xs: "flex", md: "none" },
  },
  menu: {
    display: { xs: "block", md: "none" },
  },
  logoTypography: {
    mr: 2,
    display: { xs: "flex", md: "none" },
    flexGrow: 1,
    fontFamily: "monospace",
    fontWeight: 700,
    letterSpacing: ".3rem",
    color: "inherit",
    textDecoration: "none",
  },
  button: {
    my: 2,
    color: "white",
    display: "block",
  },
};

const generatedMusicStyles: Record<string, SxProps> = {
  sheetMusicContainer: {
    display: "flex",
    width: "66%",
  },
  sheetMusic: {
    width: "100%",
    height: "500px",
    border: "1px solid grey",
    alignContent: "center",
    justifyContent: "center",
  },
  musicButtonDiv: {
    display: "flex",
    mt: 2,
    justifyContent: "center",
    gap: "1rem",
  },
};

export { navbarStyles, generatedMusicStyles };
