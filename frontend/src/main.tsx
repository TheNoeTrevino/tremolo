import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "bootstrap/dist/css/bootstrap.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import About from "./pages/About.tsx";
import HomePage from "./pages/HomePage";
import SheetMusicDisplay from "./pages/music-display/SheetMusicDisplay.tsx";
import NoteGame from "./pages/note-game/NoteGame";
import Account from "./pages/users/Account";
import Profile from "./pages/users/Profile";
import Dashboard from "./pages/users/Dashboard";
import Logout from "./pages/users/Logout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/about",
        element: <About />,
      },
      {
        path: "/note-game",
        element: <NoteGame />,
      },
      {
        path: "/sheet-music",
        element: <SheetMusicDisplay />,
      },
      {
        path: "/profile",
        element: <Profile />,
      },
      {
        path: "/dashboard",
        element: <Dashboard />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/logout",
        element: <Logout />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
