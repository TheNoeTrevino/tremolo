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

const sheetMusicStyles = {
  width: "100%",
  height: "500px",
  border: "1px solid grey",
  alignContent: "center",
};

const musicButtonStyles = {
  mt: 2,
  position: "relative",
  left: "50%",
  transform: "translateX(-50%)",
};

export { navbarStyles, sheetMusicStyles, musicButtonStyles };
