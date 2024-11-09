import {
  Box,
  Card,
  CardContent,
  Fade,
  FormControl,
  InputAdornment,
  OutlinedInput,
  SxProps,
  Typography,
} from "@mui/material";
import ThreeLinedGraph from "../../components/data-visualization/ThreeLinedGraph";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";

const mainDiv: SxProps = {
  display: "flex",
  flexDirection: "column",
  p: "1rem",
};

const graphStyles: SxProps = {
  flex: "1",
};

const Dashboard = () => {
  return (
    <Fade in={true}>
      <Box sx={mainDiv}>
        <Typography variant={"h1"}>Name</Typography>
        <div>Dashboard</div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            gap: "1rem",
          }}
        >
          <ThreeLinedGraph sx={graphStyles} />
          <Card variant="outlined" sx={graphStyles}>
            <CardContent>
              <Typography>Hello</Typography>
            </CardContent>
          </Card>
        </Box>
        <Box>
          <Typography variant="h4">
            Name: xxx, Number of students: xxx
          </Typography>
        </Box>
        <FormControl
          sx={{ width: { xs: "100%", md: "25ch" } }}
          variant="outlined"
        >
          <OutlinedInput
            size="small"
            id="search"
            placeholder="Search…"
            sx={{ flexGrow: 1 }}
            startAdornment={
              <InputAdornment position="start" sx={{ color: "text.primary" }}>
                <SearchRoundedIcon fontSize="small" />
              </InputAdornment>
            }
            inputProps={{
              "aria-label": "search",
            }}
          />
        </FormControl>
      </Box>
    </Fade>
  );
};

export default Dashboard;
