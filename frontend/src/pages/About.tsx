import { Fade } from "@mui/material";
import Box from "@mui/material/Box";

const About = () => {
  return (
    <Fade in={true} timeout={500}>
      <Box>
        <Box sx={{ mt: 2, ml: 2 }}>
          The mission of sight-reading-app (pending name) comes from my short
          time as a assistant percussion director, and includes many ambitions:
        </Box>
        <Box sx={{ mt: 1, ml: 2, width: "50%" }}>
          First and foremost, I wish something as customizable as this existed
          when I was teaching. An application that could be configured to
          repetitively practice tough patterns, both rhythmically and
          harmonically, while still maintaining the element of 'reading' rather
          than memorization, always been missing. I have always had the
          suspicion, which is not really a suspicion, more of a known fact, that
          student would simply memorize the more difficult parts of a piece. The
          issue with this approach is that muscle memory is easily made
          forgotten when someone is nervous. Where as a ingrained skill, like
          reading, will stand strong. This application will force you students
          to work on tough patters without the ability to memorize. In addition
          to this, we constantly see the same rhythms over and over again in the
          UIL sight reading room. Would it not be great to be able to dive into
          these specific patters for preparation? Or maybe practicing an easier
          version of these difficult rhythms to take the students on a more
          logical path. What about putting notes over these rhythms that are
          frequently asked? The goal of this application is to cover all of
          these corners.
        </Box>

        <Box sx={{ mt: 1, ml: 2 }}>
          Second is to provide developing musiciancs a place to hone their sight
          reading skill in a highly customizable way. This use case is mainly
          for the advanced musician, as sharpening you skills in certain chord
          structures, or scale degree jumps is not of concern to younger folk.
        </Box>
      </Box>
    </Fade>
  );
};

export default About;
