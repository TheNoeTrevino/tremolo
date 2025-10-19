import {
	Box,
	Button,
	Card,
	CardContent,
	Container,
	Grid,
	Typography,
	Avatar,
	Fade,
} from "@mui/material";
import { Link } from "react-router-dom";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import SpeedIcon from "@mui/icons-material/Speed";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SchoolIcon from "@mui/icons-material/School";
import PersonIcon from "@mui/icons-material/Person";
import GroupIcon from "@mui/icons-material/Group";
import { landingPageStyles } from "../styles";

const HomePage = () => {
	const features = [
		{
			icon: <MusicNoteIcon sx={{ fontSize: 40 }} />,
			title: "Note Recognition Game",
			description:
				"Master note reading with our interactive game that adapts to your skill level. Practice identifying notes across different octaves and scales.",
		},
		{
			icon: <SpeedIcon sx={{ fontSize: 40 }} />,
			title: "Rhythm Practice",
			description:
				"Develop sight-reading skills with customizable rhythm patterns. Practice 8th notes, 16th notes, and complex patterns at your own pace.",
		},
		{
			icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
			title: "Track Progress",
			description:
				"Monitor your improvement with detailed analytics. See accuracy rates, notes per minute, and identify areas for growth.",
		},
	];

	const steps = [
		{
			number: "1",
			title: "Choose Your Exercise",
			description:
				"Select from note games, rhythm practice, or custom exercises",
		},
		{
			number: "2",
			title: "Practice & Learn",
			description:
				"Work through exercises tailored to your skill level and goals",
		},
		{
			number: "3",
			title: "Track Improvement",
			description: "View your progress and celebrate your musical growth",
		},
	];

	const audiences = [
		{
			icon: <SchoolIcon sx={{ fontSize: 40 }} />,
			title: "Music Teachers",
			description:
				"Create custom exercises for your students. Track their progress and assign targeted practice sessions.",
		},
		{
			icon: <PersonIcon sx={{ fontSize: 40 }} />,
			title: "Students",
			description:
				"Build sight-reading confidence for auditions, competitions, and UIL. Practice anytime, anywhere.",
		},
		{
			icon: <GroupIcon sx={{ fontSize: 40 }} />,
			title: "Musicians",
			description:
				"Advanced musicians can sharpen skills in specific chord structures, scale patterns, and complex rhythms.",
		},
	];

	return (
		<Fade in={true} timeout={500}>
			<Box>
				<Box sx={landingPageStyles.heroSection}>
					<Container maxWidth="lg">
						<Typography variant="h1" sx={landingPageStyles.heroTitle}>
							Master Music Sight Reading
						</Typography>
						<Typography variant="h5" sx={landingPageStyles.heroSubtitle}>
							The customizable platform for music students, teachers, and
							performers to practice sight reading and note recognition
						</Typography>
						<Button
							component={Link}
							to="/note-game"
							variant="contained"
							color="secondary"
							size="large"
							sx={landingPageStyles.heroButton}
						>
							Start Practicing Now
						</Button>
					</Container>
				</Box>

				<Container maxWidth="lg">
					<Box sx={landingPageStyles.section}>
						<Typography variant="h3" sx={landingPageStyles.sectionTitle}>
							Everything You Need to Excel
						</Typography>
						<Grid container spacing={4}>
							{features.map((feature, index) => (
								<Grid item xs={12} md={4} key={index}>
									<Card elevation={3} sx={landingPageStyles.featureCard}>
										<CardContent sx={landingPageStyles.featureCardContent}>
											<Avatar sx={landingPageStyles.featureIcon}>
												{feature.icon}
											</Avatar>
											<Typography
												variant="h6"
												sx={landingPageStyles.featureTitle}
											>
												{feature.title}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{feature.description}
											</Typography>
										</CardContent>
									</Card>
								</Grid>
							))}
						</Grid>
					</Box>

					<Box sx={landingPageStyles.section}>
						<Typography variant="h3" sx={landingPageStyles.sectionTitle}>
							How It Works
						</Typography>
						<Box sx={{ maxWidth: "800px", mx: "auto" }}>
							{steps.map((step, index) => (
								<Box key={index} sx={landingPageStyles.stepContainer}>
									<Box sx={landingPageStyles.stepNumber}>{step.number}</Box>
									<Box>
										<Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
											{step.title}
										</Typography>
										<Typography variant="body1" color="text.secondary">
											{step.description}
										</Typography>
									</Box>
								</Box>
							))}
						</Box>
					</Box>

					<Box sx={landingPageStyles.section}>
						<Typography variant="h3" sx={landingPageStyles.sectionTitle}>
							Built For Everyone
						</Typography>
						<Grid container spacing={4}>
							{audiences.map((audience, index) => (
								<Grid item xs={12} md={4} key={index}>
									<Card elevation={2} sx={landingPageStyles.audienceCard}>
										<Avatar
											sx={{
												...landingPageStyles.featureIcon,
												mx: "auto",
											}}
										>
											{audience.icon}
										</Avatar>
										<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
											{audience.title}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{audience.description}
										</Typography>
									</Card>
								</Grid>
							))}
						</Grid>
					</Box>

					<Box
						sx={{
							...landingPageStyles.section,
							textAlign: "center",
							bgcolor: "grey.100",
							borderRadius: 2,
							py: 6,
							mb: 4,
						}}
					>
						<Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
							Ready to Improve Your Sight Reading?
						</Typography>
						<Typography variant="body1" sx={{ mb: 3, color: "text.secondary" }}>
							Join students and teachers who are already seeing results
						</Typography>
						<Box sx={{ display: "flex", gap: 2, justifyContent: "center" }}>
							<Button
								component={Link}
								to="/note-game"
								variant="contained"
								size="large"
							>
								Start Note Game
							</Button>
							<Button
								component={Link}
								to="/sheet-music"
								variant="outlined"
								size="large"
							>
								Try Rhythm Practice
							</Button>
						</Box>
					</Box>
				</Container>
			</Box>
		</Fade>
	);
};

export default HomePage;
