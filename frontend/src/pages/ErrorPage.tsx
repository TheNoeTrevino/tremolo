import { Typography } from "@mui/material";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <>
      <Typography variant="h3" mt={5} textAlign={"center"}>
        Something went wrong...
      </Typography>
      <Typography variant="h6" mt={3} textAlign="center">
        <Link to="/">Click here to go back to the home page</Link>
      </Typography>
    </>
  );
};

export default ErrorPage;
