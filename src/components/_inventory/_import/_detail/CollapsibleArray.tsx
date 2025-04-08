// CollapsibleArray.tsx
import React, { useState } from "react";
import { Box, Button, Collapse } from "@mui/material";
import { RenderValue } from "./RenderValue";

interface CollapsibleArrayProps {
  data: any[];
}

export const CollapsibleArray: React.FC<CollapsibleArrayProps> = ({ data }) => {
  const [open, setOpen] = useState<boolean>(false);
  return (
    <Box sx={{ ml: 2 }}>
      <Button variant="text" onClick={() => setOpen((prev) => !prev)}>
        {open ? "Ẩn danh sách" : "Hiện danh sách"}
      </Button>
      <Collapse in={open}>
        {data.map((item, index) => (
          <Box key={index} sx={{ ml: 2, mt: 1 }}>
            <RenderValue value={item} />
          </Box>
        ))}
      </Collapse>
    </Box>
  );
};
