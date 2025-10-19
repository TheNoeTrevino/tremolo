import Button from "@mui/material/Button";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { styled } from "@mui/material/styles";

interface FileUploadProps {
	handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const InputFileUpload = ({ handleChange }: FileUploadProps) => {
	const VisuallyHiddenInput = styled("input")({
		height: 1,
		width: 1,
	});
	const buttonStyling = {
		mt: 2,
		position: "relative",
		left: "50%",
		transform: "translateX(-50%)",
	};

	return (
		<Button
			sx={buttonStyling}
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
