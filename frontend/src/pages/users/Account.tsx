import { Box, Card, Typography } from "@mui/material";

const Account = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: "2rem",
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
          <Typography>Full Name</Typography>
          <Typography>School Name</Typography>
          <Typography>Name</Typography>
          <Typography>Name</Typography>
        </Box>
      </Card>
      <Card variant="outlined">Photo here </Card>
    </Box>
  );
};

export default Account;
