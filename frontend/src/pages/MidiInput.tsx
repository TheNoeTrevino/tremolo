import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  Input,
  InputLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import { ChangeEvent, useState } from "react";

const MidiInput = () => {
  const [selectedValue, setSelectedValue] = useState<string>("test0value");

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    console.log(event);
    setSelectedValue(event.target.value);
  };

  // TODO: when radio buttons are clicked
  return (
    <>
      <FormGroup sx={{ mt: 3, ml: 2 }}>
        <FormControl>
          <InputLabel htmlFor="my-input">Email address</InputLabel>
          <InputLabel htmlFor="file-input">Email address</InputLabel>
          <Input id="my-input" />
          <FormHelperText id="my-helper-text" sx={{ mt: 2 }}>
            We'll never share your email.
          </FormHelperText>
        </FormControl>
        <RadioGroup value={selectedValue} onChange={handleChange}>
          <FormControlLabel
            control={<Radio />}
            label="test0"
            value="chimichanga"
          ></FormControlLabel>
          <FormControlLabel
            control={<Radio />}
            label="test1"
            value="test1value"
          ></FormControlLabel>
          <FormControlLabel
            control={<Radio />}
            label="test2"
            value="test2value"
          ></FormControlLabel>
        </RadioGroup>
        <FormControl>
          <Input id="file-input" type="file" />
          <FormHelperText id="file-helper-text" sx={{ mt: 2 }}>
            file input
          </FormHelperText>
        </FormControl>
      </FormGroup>
    </>
  );
};

export default MidiInput;
