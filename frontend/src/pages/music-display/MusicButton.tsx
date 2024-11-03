import { Menu, MenuItem, SxProps } from "@mui/material";
import Box from "@mui/material/Box/Box";
import Button from "@mui/material/Button/Button";
import { MouseEvent } from "react";

interface ButtonProps {
  text: string;
  handleClick: (event: MouseEvent<HTMLElement>) => void;
  options: { name: string; option: string }[];
  anchorEl: null | HTMLElement;
  open: boolean;
  handleClose: () => void;
  handleOptionClick: (option: string) => void;
  styles: SxProps;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
}

const MusicButton = ({
  text,
  handleClick,
  options,
  anchorEl,
  open,
  handleClose,
  handleOptionClick,
  styles,
  startIcon,
  endIcon,
}: ButtonProps) => {
  return (
    <Box>
      <Button
        id="demo-positioned-button"
        variant="contained"
        sx={styles}
        onClick={handleClick}
        startIcon={startIcon}
        endIcon={endIcon}
      >
        {text}
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        {options.map((o) => (
          <MenuItem
            key={o.name}
            onClick={() => {
              handleOptionClick(o.option);
              handleClose();
            }}
            sx={{
              color: "primary",
            }}
          >
            {o.name}
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default MusicButton;
