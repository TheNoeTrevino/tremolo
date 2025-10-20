import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { Box, createTheme, ThemeProvider } from "@mui/material";

// https://colorhunt.co/palette/1e201e3c3d37697565ecdfcc
// make all componenets outlined by default, then go back and fix any that we
// would want differenently. It is probably a good idea to move each different
// button into its own component so we can easily change the default props
const theme = createTheme({
	components: {
		MuiAppBar: {
			defaultProps: {
				variant: "outlined",
			},
		},
		MuiCard: {
			defaultProps: {
				variant: "outlined",
				style: { marginTop: 8 },
			},
		},
		MuiButton: {
			defaultProps: {
				disableElevation: true,
				variant: "outlined",
				style: { marginTop: 8 },
			},
		},
	},
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
