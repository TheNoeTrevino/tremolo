import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

interface FileUploadProps {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const InputFileUpload = ({ handleChange }: FileUploadProps) => {
  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });

  return (
    <Button
      sx={{
        mt: 2,
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
      }}
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={<CloudUploadIcon />}
    >
      Upload files
      <VisuallyHiddenInput
        type="file"
        onChange={handleChange}
        multiple
        accept=".xml"
      />
    </Button>
  );
};

export default InputFileUpload;
