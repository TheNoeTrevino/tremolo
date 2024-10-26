import { useAuth0 } from "@auth0/auth0-react";
import { Box, Button, Typography } from "@mui/material";

const Profile = () => {
  const { user, isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return isAuthenticated && user ? (
    <Box>
      <img src={user.picture} alt={user.name} />
      <Typography variant="h1">{user.name}</Typography>
      <Box>{user.email}</Box>
    </Box>
  ) : (
    <Box>
      <Typography variant="h3" textAlign="center" sx={{ mt: 10 }}>
        You are not currently logged in!
      </Typography>

      <Typography variant="h4" textAlign="center" sx={{ mt: 10 }}>
        Please Log In Below
      </Typography>
      <Button
        id="demo-positioned-button"
        variant="contained"
        sx={{
          mt: 10,
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)",
        }}
        onClick={() => loginWithRedirect()}
      >
        Log In
      </Button>
    </Box>
  );
};

export default Profile;
