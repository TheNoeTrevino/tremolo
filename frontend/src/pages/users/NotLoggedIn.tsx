import { Box, Button, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotLoggedIn = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "5rem",
        margin: "2rem",
        alignItems: "center",
      }}
    >
      <Typography variant="h3" textAlign="center">
        You are not currently logged in!
      </Typography>

      <Typography variant="h4" textAlign="center">
        Please Log In Below
      </Typography>
      <Button
        key="login"
        component={Link}
        to={"../login"}
        variant="contained"
        sx={{ width: "9rem" }}
      >
        Log In
      </Button>
    </Box>
  );
};

export default NotLoggedIn;
