import Box from "@mui/material/Box";

const Footer = () => {
  const footerStyling = {
    mt: 10,
    textAlign: "center",
    bgcolor: "primary",
    border: "1px dashed",
    position: "relative",
    width: "100%",
    bottom: 0,
  };

  return (
    <Box component="footer" sx={footerStyling}>
      Footer
    </Box>
  );
};

export default Footer;
