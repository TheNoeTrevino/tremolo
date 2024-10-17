import { Box } from "@mui/material";
import InputFileUpload from "./FileUpload";

const Converter = () => {
  return (
    <>
      <Box
        id="sheet-music-div"
        sx={{ width: "100%", height: "500px", border: "1px solid grey" }}
      ></Box>
      <InputFileUpload />
    </>
  );
};

export default Converter;
