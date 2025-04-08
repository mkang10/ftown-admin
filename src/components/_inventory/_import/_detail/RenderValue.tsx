// RenderValue.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { CollapsibleArray } from "./CollapsibleArray";

interface RenderValueProps {
  value: any;
}

export const RenderValue: React.FC<RenderValueProps> = ({ value }) => {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value !== "object") {
    return <Typography variant="body2">{String(value)}</Typography>;
  }
  if (Array.isArray(value)) {
    if (value.length === 0) return null;
    return <CollapsibleArray data={value} />;
  }
  const entries = Object.entries(value).filter(
    ([, v]) => v !== null && v !== undefined && v !== ""
  );
  if (entries.length === 0) return null;
  return (
    <Box sx={{ ml: 2 }}>
      {entries.map(([key, val]) => (
        <Box key={key} sx={{ mb: 1 }}>
          <Typography variant="body2">
            <strong>{key}:</strong>{" "}
            {typeof val === "object" ? <RenderValue value={val} /> : String(val)}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};
