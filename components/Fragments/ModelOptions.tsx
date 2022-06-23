import { RotateLeft, RotateRight, Settings } from "@mui/icons-material";
import { Box, Card, CardContent, Collapse, IconButton, Slider, Stack } from "@mui/material";
import { useState } from "react";
const marks = [
  { value: 1, label: "1x" },
  { value: 2, label: "2x" },
  { value: 3, label: "3x" },
];
const ModelOptions: React.FC<any> = ({ options, setOptions }) => {
  const [open, setOpen] = useState(true);
  return (
    <Card sx={{ position: "absolute", top: 0, right: 0, width: !open ? 50 : undefined, borderRadius: 5 }}>
      <IconButton onClick={() => setOpen(!open)}>
        <Settings />
      </IconButton>
      <Collapse in={open}>
        <CardContent>
          <Stack>
            <Stack direction={"row"}>
              <IconButton onClick={() => setOptions({ ...options, rotation: options.rotation + 90 })}>
                <RotateRight />
              </IconButton>
              <IconButton onClick={() => setOptions({ ...options, rotation: options.rotation - 90 })}>
                <RotateLeft />
              </IconButton>
            </Stack>
            <Box sx={{ width: 100 }}>
              <Slider
                value={options.scale}
                onChange={(e, scale) => {
                  setOptions({ ...options, scale });
                }}
                defaultValue={1}
                step={null}
                valueLabelDisplay="auto"
                marks={marks}
                min={1}
                max={marks.length}
              />
            </Box>
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ModelOptions;
