import { Outlet } from "react-router-dom";
import Navbar from "./components/navbar/Navbar";
import { Box } from "@mui/material";
import { ThemeContextProvider } from "./contexts/ThemeContext";

function App() {
  return (
    <ThemeContextProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Navbar />
        <div id="detail">
          <Outlet />
        </div>
      </Box>
    </ThemeContextProvider>
  );
}
export default App;
