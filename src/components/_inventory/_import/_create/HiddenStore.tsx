"use client";
import React from "react";
import { Box, Grid, TextField, Typography } from "@mui/material";

export interface StoreAllocation {
  storeId: number;
  allocatedQuantity: number;
  status: string;
  comments: string;
  staffDetailId: number;
}

interface HiddenStoreAllocationsProps {
  allocations: StoreAllocation[];
  onAllocationChange: (index: number, value: number) => void;
  onStoreIdChange: (index: number, value: number) => void;
}

const HiddenStoreAllocations: React.FC<HiddenStoreAllocationsProps> = ({
  allocations,
  onAllocationChange,
  onStoreIdChange,
}) => {
  return (
    <Box>
      <Typography variant="subtitle1">Store Allocations</Typography>
      {allocations.map((allocation, index) => (
        <Grid container spacing={2} key={index} sx={{ mt: 1 }}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Store ID"
              type="number"
              value={allocation.storeId}
              onChange={(e) => onStoreIdChange(index, Number(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Allocated Quantity"
              type="number"
              value={allocation.allocatedQuantity}
              onChange={(e) => onAllocationChange(index, Number(e.target.value))}
              fullWidth
            />
          </Grid>
        </Grid>
      ))}
    </Box>
  );
};

export default HiddenStoreAllocations;
