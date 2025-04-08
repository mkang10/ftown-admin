"use client";
import React from "react";
import { Box, Button, ButtonGroup, Typography } from "@mui/material";

export interface DistributionControlsProps {
  totalQuantity: number;
  count: number;
  distributionMode: "equal" | "custom";
  onSetEqual: () => void;
  onSetCustom: () => void;
}

const DistributionControls: React.FC<DistributionControlsProps> = ({
  totalQuantity,
  count,
  distributionMode,
  onSetEqual,
  onSetCustom,
}) => {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="subtitle2">Distribution Mode</Typography>
      <ButtonGroup size="small" variant="outlined">
        <Button variant={distributionMode === "equal" ? "contained" : "outlined"} onClick={onSetEqual}>
          Equal Split
        </Button>
        <Button variant={distributionMode === "custom" ? "contained" : "outlined"} onClick={onSetCustom}>
          Custom
        </Button>
      </ButtonGroup>
    </Box>
  );
};

export default DistributionControls;
