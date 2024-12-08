import { LoginRounded } from "@mui/icons-material";
import { Box, Button, Card, Fade, TextField } from "@mui/material";

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
          <Button variant="contained" endIcon=<LoginRounded />>
            Log In
          </Button>
        </Card>
      </Box>
    </Fade>
  );
};

export default Login;
