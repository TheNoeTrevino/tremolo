import { LoginRounded, Person, SignalWifi4BarSharp } from "@mui/icons-material";
import { Box, Button, Card, Fade, TextField, Typography } from "@mui/material";
import { UserService } from "../services/UserService";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <Fade in={true}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card
          variant="outlined"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "2rem",
            m: "2rem",
            padding: "2rem",
          }}
        >
          <Box>Sign in for the full experience.</Box>
          <TextField required id="outlined-required" label="Username" />
          <TextField
            required
            id="outlined-password-input"
            label="Password"
            type="password"
          />
          <Button
            variant="contained"
            // here we are going to what to pass in the password they have at
            // the moment
            // onClick={UserService.loginUser(username, password)}
            onClick={() => alert("hello")}
            endIcon=<LoginRounded />
          >
            Log In
          </Button>
          <Typography>If you don't have an account: </Typography>
          <Button
            key="signup"
            component={Link}
            to={"../signup"}
            variant="contained"
            // here we are going to what to pass in the password they have at
            // the moment
            // onClick={UserService.loginUser(username, password)}
            endIcon=<Person />
          >
            Sign Up
          </Button>
        </Card>
      </Box>
    </Fade>
  );
};

export default Login;
