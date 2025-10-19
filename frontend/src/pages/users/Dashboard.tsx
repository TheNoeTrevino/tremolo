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
} from "@mui/material";
import ThreeLinedGraph from "../../components/data-visualization/ThreeLinedGraph";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const mainDiv: SxProps = {
	display: "flex",
	flexDirection: "column",
	p: "1rem",
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
	return (
		<Fade in={true}>
			<Box sx={mainDiv}>
				<Typography variant={"h1"}>Name</Typography>
				<div>Dashboard</div>
				<Box
					sx={{
						display: "flex",
						flexDirection: "row",
						justifyContent: "space-evenly",
						gap: "1rem",
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
							<Typography>Hello</Typography>
						</CardContent>
					</Card>
				</Box>
				<Box>
					<Typography variant="h4">
						Name: xxx, Number of students: xxx
					</Typography>
				</Box>
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
		</Fade>
	);
};

export default Dashboard;
