import { Box, Typography } from "@mui/material";
import InputFileUpload from "./FileUpload";
import { useState } from "react";
import { MusicService } from "../services/MusicService";

const Converter = () => {
  const [isVisible, setVisibility] = useState<boolean>(false);

  const boxStyling = {
    width: "100%",
    height: "500px",
    border: "1px solid grey",
    alignContent: "center",
  };

  return (
    <>
      <Box id="sheet-music-div" sx={boxStyling}>
        {!isVisible && (
          <Typography variant="h6" textAlign="center">
            Click the button below to upload the sheet music
          </Typography>
        )}
      </Box>

      <InputFileUpload
        handleChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          MusicService.displayXml(event.target.files);
          setVisibility(true);
        }}
      />
    </>
  );
};

export default Converter;
