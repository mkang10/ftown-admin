"use client";
import React from "react";
import { Box, Button, Typography } from "@mui/material";
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
  <Box
    sx={{
      mt: 3,
      p: 3,
      backgroundColor: "#fff",
      border: "0px solid #000",
      borderRadius: 3,
      boxShadow: 4,
      "&:hover": { boxShadow: 6 },
    }}
  >
    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: 700,
        textTransform: "uppercase",
        letterSpacing: "1px",
        mb: 2,
        borderBottom: "2px solid #000",
        pb: 1,
        color: "#000",
      }}
    >
      Phân bổ kho
    </Typography>

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

    <Box hidden sx={{ textAlign: "center", mt: 2 }}>
      <Button
        startIcon={<AddIcon />}
        onClick={onAddStoreAllocation}
        size="small"
        variant="outlined"
        sx={{
          border: "2px solid #000",
          color: "#000",
          backgroundColor: "#fff",
          borderRadius: 2,
          textTransform: "uppercase",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: "#000",
            color: "#fff",
          },
        }}
      >
        Thêm phân bổ
      </Button>
    </Box>
  </Box>
);

export default StoreAllocationList;
