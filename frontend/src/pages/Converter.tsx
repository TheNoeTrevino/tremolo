import { Box, Paper, Typography } from "@mui/material";
import InputFileUpload from "./FileUpload";
import { useState } from "react";
import { displayXml } from "../services/MusicService";
import { centerInBox, sheetMusicStyles } from "../styles";

const Converter = () => {
  const [isVisible, setVisibility] = useState<boolean>(false);

  return (
    <>
      <Box sx={{ ...centerInBox }}>
        <Paper id="sheet-music-div" elevation={6} sx={{ ...sheetMusicStyles }}>
          {!isVisible && (
            <Box>
              <Typography variant="h6" textAlign="center">
                Click the button below to upload the sheet music
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>

      <InputFileUpload
        handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          displayXml(event.target.files);
          setVisibility(true);
        }}
      />
    </>
  );
};

export default Converter;
