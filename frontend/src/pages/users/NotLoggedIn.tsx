import { Box, Button, Typography } from "@mui/material";

const NotLoggedIn = () => {
	return (
		<Box>
			<Typography variant="h3" textAlign="center" sx={{ mt: 10 }}>
				You are not currently logged in!
			</Typography>

			<Typography variant="h4" textAlign="center" sx={{ mt: 10 }}>
				Please Log In Below
			</Typography>
			<Button
				id="demo-positioned-button"
				variant="contained"
				sx={{
					mt: 10,
					position: "relative",
					left: "50%",
					transform: "translateX(-50%)",
				}}
			>
				Log In
			</Button>
		</Box>
	);
};

export default NotLoggedIn;
