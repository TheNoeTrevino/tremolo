import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Box, createTheme, ThemeProvider } from "@mui/material";
import Footer from "./components/Footer";
import { Auth0Provider } from "@auth0/auth0-react";
import { getAuthDomain, getClientID } from "./Secret";

// https://colorhunt.co/palette/1e201e3c3d37697565ecdfcc
const theme = createTheme({
  palette: {
    primary: {
      main: "#1E201E",
    },
    secondary: {
      main: "#3C3D37",
    },
  },
});

function App() {
  return (
    <Auth0Provider
      domain={getAuthDomain()}
      clientId={getClientID()}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <ThemeProvider theme={theme}>
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
          <Footer />
        </Box>
      </ThemeProvider>
    </Auth0Provider>
  );
}
export default App;
