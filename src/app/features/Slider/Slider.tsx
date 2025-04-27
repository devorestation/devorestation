import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";

const Input = styled(MuiInput)`
  width: 42px;
`;

interface InputSliderProps {
  setter: (val) => void;
  name: string;
  value: number;
  range: [number, number];
  step: number;
}

export default function InputSlider(props: InputSliderProps) {
  const { name, setter, value: i_value, range, step } = props;

  const [value, setValue] = React.useState(i_value);

  const handleSliderChange = (event: Event, newValue: number) => {
    setValue(newValue);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value === "" ? 0 : Number(event.target.value));
  };

  React.useEffect(() => {
    if (setter != null) setter(value);
  }, [setter, value]);

  const handleBlur = () => {
    if (value < range[0]) {
      setValue(range[0]);
    } else if (value > range[1]) {
      setValue(range[1]);
    }
  };

  return (
    <Box sx={{ width: 250 }}>
      <Typography id="input-slider" gutterBottom>
        {name}
      </Typography>
      <Grid container spacing={2} sx={{ alignItems: "center" }}>
        <Grid></Grid>
        <Grid size="grow">
          <Slider
            value={typeof value === "number" ? value : 0}
            onChange={handleSliderChange}
            aria-labelledby="input-slider"
            min={range[0]}
            max={range[1]}
            step={step}
          />
        </Grid>
        <Grid>
          <Input
            value={value}
            size="small"
            onChange={handleInputChange}
            onBlur={handleBlur}
            className="w-[50px]"
            style={{ width: "50px" }}
            inputProps={{
              step: step,
              min: range[0],
              max: range[1],
              type: "number",
              "aria-labelledby": "input-slider",
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
