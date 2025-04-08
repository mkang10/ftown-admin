"use client";
import React from "react";
import { Box, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import StoreAllocationRow, { StoreAllocation } from "./StoreAllocationRow";

export interface StoreAllocationListProps {
  allocations: StoreAllocation[];
  distributionMode: "equal" | "custom";
  warehouseNames: string[];
  allocationError: string;
  onAllocationChange: (allocationIndex: number, value: number) => void;
  onRemoveStoreAllocation: (allocationIndex: number) => void;
  onAddStoreAllocation: () => void;
  onOpenWarehouse: (allocationIndex: number) => void;
}

const StoreAllocationList: React.FC<StoreAllocationListProps> = ({
  allocations,
  distributionMode,
  warehouseNames,
  allocationError,
  onAllocationChange,
  onRemoveStoreAllocation,
  onAddStoreAllocation,
  onOpenWarehouse,
}) => (
  <Box sx={{ mt: 2 }}>
    {allocations.map((alloc, idx) => (
      <StoreAllocationRow
        key={idx}
        allocation={alloc}
        index={idx}
        distributionMode={distributionMode}
        warehouseName={warehouseNames[idx] || ""}
        allocationError={allocationError}
        canRemove={allocations.length > 1}
        onAllocationChange={onAllocationChange}
        onRemove={() => onRemoveStoreAllocation(idx)}
        onOpenWarehouse={() => onOpenWarehouse(idx)}
      />
    ))}
    <Button
      startIcon={<AddIcon />}
      onClick={onAddStoreAllocation}
      sx={{ mt: 1 }}
      size="small"
      variant="outlined"
    >
      Add Store
    </Button>
  </Box>
);

export default StoreAllocationList;
