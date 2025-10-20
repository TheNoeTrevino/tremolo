import {
	Box,
	Card,
	Container,
	Typography,
	Avatar,
	Fade,
	Divider,
} from "@mui/material";
import AutoStoriesIcon from "@mui/icons-material/AutoStories";
import PsychologyIcon from "@mui/icons-material/Psychology";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { landingPageStyles } from "../styles";

const About = () => {
	return (
		<Fade in={true} timeout={500}>
			<Container maxWidth="lg">
				<Box sx={landingPageStyles.section}>
					<Typography variant="h2" sx={landingPageStyles.sectionTitle}>
						About Tremolo
					</Typography>

					<Card elevation={6} sx={landingPageStyles.missionCard}>
						<Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
							Our Mission
						</Typography>
						<Typography
							variant="body1"
							sx={{ fontSize: "1.1rem", lineHeight: 1.8 }}
						>
							Born from real classroom experience as an assistant percussion
							director, Tremolo aims to revolutionize how students practice and
							master sight reading. We believe in building genuine skills over
							memorization, providing tools that adapt to each student's journey
							from beginner to advanced musician.
						</Typography>
					</Card>

					<Box sx={landingPageStyles.contentSection}>
						<Typography variant="h4" sx={{ fontWeight: 700, mb: 3, mt: 4 }}>
							For Music Educators
						</Typography>

						<Box sx={landingPageStyles.iconTextSection}>
							<Avatar sx={landingPageStyles.sectionIcon}>
								<AutoStoriesIcon sx={{ fontSize: 32 }} />
							</Avatar>
							<Box>
								<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
									Real Reading, Not Memorization
								</Typography>
								<Typography variant="body1" sx={{ mb: 2, lineHeight: 1.8 }}>
									When I was teaching, I always wished for a tool like this. An
									application that could be configured to repetitively practice
									tough patterns, both rhythmically and harmonically, while
									maintaining the element of genuine reading rather than
									memorization.
								</Typography>
								<Typography variant="body1" sx={{ lineHeight: 1.8 }}>
									Students often memorize difficult passages, but muscle memory
									fails under pressure. True sight-reading skills, however,
									remain strong even when nerves kick in. This application
									forces students to develop real reading skills by preventing
									memorization through dynamic, changing exercises.
								</Typography>
							</Box>
						</Box>

						<Box sx={landingPageStyles.iconTextSection}>
							<Avatar sx={landingPageStyles.sectionIcon}>
								<EmojiEventsIcon sx={{ fontSize: 32 }} />
							</Avatar>
							<Box>
								<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
									UIL-Focused Practice
								</Typography>
								<Typography variant="body1" sx={{ lineHeight: 1.8 }}>
									We constantly see the same rhythms appear in UIL sight reading
									rooms. Wouldn't it be great to dive into these specific
									patterns for preparation? Or practice simplified versions of
									difficult rhythms to guide students along a more logical
									learning path? What about applying notes over
									frequently-tested rhythms? Our goal is to address all these
									needs.
								</Typography>
							</Box>
						</Box>

						<Box sx={landingPageStyles.iconTextSection}>
							<Avatar sx={landingPageStyles.sectionIcon}>
								<PsychologyIcon sx={{ fontSize: 32 }} />
							</Avatar>
							<Box>
								<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
									Customizable Learning Paths
								</Typography>
								<Typography variant="body1" sx={{ lineHeight: 1.8 }}>
									Every student is different. Create exercises tailored to your
									ensemble's specific challenges. Focus on the exact rhythms,
									intervals, or patterns your students struggle with, and watch
									their confidence grow as they master each concept.
								</Typography>
							</Box>
						</Box>
					</Box>

					<Divider sx={{ my: 6 }} />

					<Box sx={landingPageStyles.contentSection}>
						<Typography variant="h4" sx={{ fontWeight: 700, mb: 3 }}>
							For Developing Musicians
						</Typography>

						<Box sx={landingPageStyles.iconTextSection}>
							<Avatar sx={landingPageStyles.sectionIcon}>
								<MusicNoteIcon sx={{ fontSize: 32 }} />
							</Avatar>
							<Box>
								<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
									Advanced Skill Development
								</Typography>
								<Typography variant="body1" sx={{ lineHeight: 1.8 }}>
									This platform provides developing musicians a place to hone
									their sight-reading skills in a highly customizable way.
									Advanced musicians can sharpen their abilities with specific
									chord structures, scale degree jumps, and complex intervallic
									patterns that challenge and refine their musicianship.
								</Typography>
							</Box>
						</Box>

						<Box sx={landingPageStyles.iconTextSection}>
							<Avatar sx={landingPageStyles.sectionIcon}>
								<TrendingUpIcon sx={{ fontSize: 32 }} />
							</Avatar>
							<Box>
								<Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
									Practice What You Need
								</Typography>
								<Typography variant="body1" sx={{ lineHeight: 1.8 }}>
									Whether you're preparing for an audition, working on a
									challenging piece, or simply want to improve your overall
									musicianship, Tremolo adapts to your needs. Set your
									parameters, choose your difficulty, and watch your skills grow
									with measurable progress.
								</Typography>
							</Box>
						</Box>
					</Box>

					<Card
						elevation={3}
						sx={{ mt: 6, mb: 4, bgcolor: "grey.50", p: 4, textAlign: "center" }}
					>
						<Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
							The Vision
						</Typography>
						<Typography
							variant="body1"
							sx={{
								fontSize: "1.1rem",
								lineHeight: 1.8,
								maxWidth: "800px",
								mx: "auto",
							}}
						>
							Tremolo aims to be the comprehensive solution for sight-reading
							practice—covering every corner from beginner fundamentals to
							advanced musical concepts. Whether you're a 6th grader learning
							your first rhythms or a seasoned musician refining your craft,
							this platform grows with you.
						</Typography>
					</Card>
				</Box>
			</Container>
		</Fade>
	);
};

export default About;
