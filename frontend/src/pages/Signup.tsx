import { Box, Button, Card, Fade, TextField, Typography } from "@mui/material";

const Signup = () => {
  return (
    <Fade in={true}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          m: "2rem",
        }}
      >
        <Card variant="outlined">
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              padding: "2rem",
            }}
          >
            <Typography textAlign={"center"}>
              Enter your schools information below to get started with us.
            </Typography>

            <Box sx={{ display: "flex", gap: "2rem" }}>
              <TextField required id="outlined-required" label="First Name" />
              <TextField required id="outlined-required" label="Last Name" />
            </Box>
            <Box sx={{ display: "flex", gap: "2rem" }}>
              <TextField required id="outlined-required" label="School" />
              <TextField required id="outlined-required" label="Teacher" />
            </Box>
            <TextField required id="outlined-required" label="Email" />
            <TextField required id="outlined-required" label="Username" />
            <TextField
              required
              id="outlined-password-input"
              label="Password"
              type="password"
            />
            <Button
              variant="contained"
              onClick={() => {
                alert("hello");
              }}
            >
              Sign Up
            </Button>
          </Box>
        </Card>
      </Box>
    </Fade>
  );
};

export default Signup;
