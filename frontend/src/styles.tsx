import { SxProps } from "@mui/material";

// TODO: change ALL of the box shadown to simply fade to a lighter gray on
// hover
const navbarStyles: Record<string, SxProps> = {
	musicNoteIcon: {
		display: { xs: "none", md: "flex" },
		mr: 1,
	},
	smdTypography: {
		mr: 2,
		display: { xs: "none", md: "flex" },
		fontFamily: "monospace",
		fontWeight: 700,
		letterSpacing: ".3rem",
		color: "inherit",
		textDecoration: "none",
	},
	menuIconButton: {
		flexGrow: 1,
		display: { xs: "flex", md: "none" },
	},
	menu: {
		display: { xs: "block", md: "none" },
	},
	logoTypography: {
		mr: 2,
		display: { xs: "flex", md: "none" },
		flexGrow: 1,
		fontFamily: "monospace",
		fontWeight: 700,
		letterSpacing: ".3rem",
		color: "inherit",
		textDecoration: "none",
	},
	button: {
		my: 2,
		color: "white",
		display: "block",
	},
};

const generatedMusicStyles: Record<string, SxProps> = {
	sheetMusicContainer: {
		display: "flex",
		width: "66%",
	},
	sheetMusic: {
		width: "100%",
		height: "35rem",
		alignContent: "center",
		justifyContent: "center",
	},
	musicButtonDiv: {
		display: "flex",
		mt: 2,
		justifyContent: "center",
		gap: "1rem",
	},
};

const landingPageStyles: Record<string, SxProps> = {
	heroSection: {
		bgcolor: "primary.main",
		color: "white",
		py: { xs: 8, md: 12 },
		textAlign: "center",
	},
	heroTitle: {
		fontWeight: 700,
		mb: 2,
		fontSize: { xs: "2.5rem", md: "3.5rem" },
	},
	heroSubtitle: {
		mb: 4,
		fontSize: { xs: "1.2rem", md: "1.5rem" },
		opacity: 0.9,
	},
	heroButton: {
		px: 4,
		py: 1.5,
		fontSize: "1.1rem",
		fontWeight: 600,
	},
	section: {
		py: { xs: 6, md: 8 },
	},
	sectionTitle: {
		fontWeight: 700,
		mb: 4,
		textAlign: "center",
	},
	featureCard: {
		height: "100%",
		display: "flex",
		flexDirection: "column",
		transition: "transform 0.2s, box-shadow 0.2s",
		"&:hover": {
			transform: "translateY(-8px)",
			boxShadow: 6,
		},
	},
	featureCardContent: {
		flexGrow: 1,
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		textAlign: "center",
		p: 3,
	},
	featureIcon: {
		bgcolor: "primary.main",
		color: "white",
		width: 64,
		height: 64,
		mb: 2,
	},
	featureTitle: {
		fontWeight: 600,
		mb: 1,
	},
	stepContainer: {
		display: "flex",
		alignItems: "center",
		gap: 2,
		mb: 3,
	},
	stepNumber: {
		bgcolor: "primary.main",
		color: "white",
		width: 48,
		height: 48,
		borderRadius: "50%",
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		fontWeight: 700,
		fontSize: "1.2rem",
		flexShrink: 0,
	},
	contentSection: {
		py: 3,
	},
	missionCard: {
		p: 4,
		mb: 4,
		bgcolor: "primary.main",
		color: "white",
	},
	iconTextSection: {
		display: "flex",
		gap: 3,
		alignItems: "flex-start",
		mb: 4,
	},
	sectionIcon: {
		bgcolor: "primary.main",
		color: "white",
		width: 56,
		height: 56,
		flexShrink: 0,
	},
	audienceCard: {
		p: 3,
		height: "100%",
		textAlign: "center",
		transition: "transform 0.2s, box-shadow 0.2s",
		"&:hover": {
			transform: "translateY(-8px)",
			boxShadow: 6,
		},
	},
};

export { navbarStyles, generatedMusicStyles, landingPageStyles };
