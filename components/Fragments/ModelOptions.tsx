import { RotateLeft, RotateRight, Settings } from "@mui/icons-material";
import { Box, Button, Card, CardContent, CardHeader, Collapse, IconButton, Stack } from "@mui/material";
import { useState } from "react";

const ModelOptions: React.FC = () => {
  const [open, setOpen] = useState(true);
  return (
    <Card sx={{ position: "absolute", top: 0, right: 0, width: !open ? 50 : undefined, borderRadius: 5 }}>
      <IconButton onClick={() => setOpen(!open)}>
        <Settings />
      </IconButton>
      <Collapse in={open}>
        <CardContent>
          <Stack direction={"row"}>
            <IconButton id="rotateRight">
              <RotateRight />
            </IconButton>
            <IconButton id="rotateLeft">
              <RotateLeft />
            </IconButton>
          </Stack>
        </CardContent>
      </Collapse>
    </Card>
  );
};

export default ModelOptions;
