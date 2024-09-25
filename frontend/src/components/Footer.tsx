import Box from "@mui/material/Box";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        mt: 10,
        textAlign: "center",
        bgcolor: "primary",
        border: "1px dashed",
        position: "relative",
        width: "100%",
        bottom: 0,
      }}
    >
      Footer
    </Box>
  );
};

export default Footer;
