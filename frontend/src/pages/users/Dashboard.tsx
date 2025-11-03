import {
	Box,
	Card,
	CardContent,
	Fade,
	FormControl,
	InputAdornment,
	OutlinedInput,
	SxProps,
	Typography,
	Chip,
	Button,
	Container,
} from "@mui/material";
import ThreeLinedGraph from "../../components/data-visualization/ThreeLinedGraph";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";

// TODO: use the charts.js package instead of the mui charts. Like monkey type
// Also go an uninstall/install the packages

const mainDiv: SxProps = {
	display: "flex",
	flexDirection: "column",
	p: { xs: "0.5rem", sm: "1rem", md: "2rem" },
};

const graphStyles: SxProps = {
	flex: "1",
};

// place holder data
const dataLineOne = [
	300, 900, 600, 1200, 1500, 1800, 2400, 2100, 2700, 3000, 1800, 3300, 3600,
	3900, 4200, 4500, 3900, 4800, 5100, 5400, 4800, 5700, 6000, 6300, 6600, 6900,
	7200, 7500, 7800, 8100,
];
const dataLineTwo = [
	500, 900, 700, 1400, 1100, 1700, 2300, 2000, 2600, 2900, 2300, 3200, 3500,
	3800, 4100, 4400, 2900, 4700, 5000, 5300, 5600, 5900, 6200, 6500, 5600, 6800,
	7100, 7400, 7700, 8000,
];
const dataLineThree = [
	1000, 1500, 1200, 1700, 1300, 2000, 2400, 2200, 2600, 2800, 2500, 3000, 3400,
	3700, 3200, 3900, 4100, 3500, 4300, 4500, 4000, 4700, 5000, 5200, 4800, 5400,
	5600, 5900, 6100, 6300,
];

const Dashboard = () => {
	const { currentUser, logout } = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		logout();
		navigate("/login");
	};

	const getRoleColor = (
		role: string,
	): "primary" | "secondary" | "success" | "error" | "info" | "warning" => {
		switch (role) {
			case "teacher":
				return "primary";
			case "student":
				return "success";
			case "parent":
				return "info";
			default:
				return "secondary";
		}
	};

	return (
		<Fade in={true}>
			<Container maxWidth="xl">
				<Box sx={mainDiv}>
					{currentUser && (
						<Box
							sx={{
								mb: 3,
								display: "flex",
								flexDirection: { xs: "column", sm: "row" },
								justifyContent: "space-between",
								alignItems: { xs: "flex-start", sm: "center" },
								gap: 2,
							}}
						>
							<Box>
								<Typography
									variant="h3"
									sx={{
										fontWeight: 600,
										mb: 1,
										fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
									}}
								>
									Welcome, {currentUser.first_name} {currentUser.last_name}!
								</Typography>
								<Chip
									label={currentUser.role.toUpperCase()}
									color={getRoleColor(currentUser.role)}
									size="medium"
									sx={{ fontWeight: 600 }}
								/>
							</Box>
							<Button
								variant="outlined"
								color="error"
								onClick={handleLogout}
								sx={{ alignSelf: { xs: "stretch", sm: "center" } }}
							>
								Logout
							</Button>
						</Box>
					)}

					<Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
						Dashboard
					</Typography>

					<Box
						sx={{
							display: "flex",
							flexDirection: { xs: "column", md: "row" },
							justifyContent: "space-evenly",
							gap: "1rem",
							mb: 3,
						}}
					>
						<ThreeLinedGraph
							sx={graphStyles}
							lineOne={dataLineOne}
							lineTwo={dataLineTwo}
							lineThree={dataLineThree}
						/>
						<Card variant="outlined" sx={graphStyles}>
							<CardContent>
								<Typography variant="h6" gutterBottom>
									Quick Stats
								</Typography>
								<Typography variant="body2" color="text.secondary">
									More features coming soon...
								</Typography>
							</CardContent>
						</Card>
					</Box>

					{currentUser && currentUser.role === "teacher" && (
						<Box sx={{ mb: 3 }}>
							<Typography variant="h6" sx={{ mb: 1 }}>
								Teacher Dashboard
							</Typography>
							<Typography variant="body1" color="text.secondary">
								Name: {currentUser.first_name} {currentUser.last_name} | Number
								of students: Coming soon
							</Typography>
						</Box>
					)}

					<FormControl
						sx={{ width: { xs: "100%", md: "25ch" } }}
						variant="outlined"
					>
						<OutlinedInput
							size="small"
							id="search"
							placeholder="Search…"
							sx={{ flexGrow: 1 }}
							startAdornment={
								<InputAdornment position="start" sx={{ color: "text.primary" }}>
									<SearchRoundedIcon fontSize="small" />
								</InputAdornment>
							}
							inputProps={{
								"aria-label": "search",
							}}
						/>
					</FormControl>
				</Box>
			</Container>
		</Fade>
	);
};

export default Dashboard;
