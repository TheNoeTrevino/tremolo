import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { Box, createTheme, ThemeProvider } from "@mui/material";

// https://colorhunt.co/palette/1e201e3c3d37697565ecdfcc
const theme = createTheme({
	palette: {
		primary: {
			main: "#1E201E",
		},
		secondary: {
			main: "#3C3D37",
		},
	},
});

function App() {
	return (
		<ThemeProvider theme={theme}>
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					minHeight: "100vh",
				}}
			>
				<Navbar />
				<div id="detail">
					<Outlet />
				</div>
			</Box>
		</ThemeProvider>
	);
}
export default App;
