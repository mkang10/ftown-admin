"use client";
import React, { useState, useEffect } from "react";
import { Box, TextField, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export interface StoreAllocation {
  wareHouseId: number;
  allocatedQuantity: number;
  handleBy: number | null;
}

export interface StoreAllocationRowProps {
  allocation: StoreAllocation;
  index: number;
  distributionMode: "equal" | "custom";
  warehouseName: string;
  canRemove: boolean;
  allocationError: string;
  onAllocationChange: (allocationIndex: number, value: number) => void;
  onRemove: () => void;
  onOpenWarehouse: () => void;
}

const StoreAllocationRow: React.FC<StoreAllocationRowProps> = ({
  allocation,
  index,
  distributionMode,
  warehouseName,
  canRemove,
  allocationError,
  onAllocationChange,
  onRemove,
  onOpenWarehouse,
}) => {
  const [localValue, setLocalValue] = useState<string>(
    allocation.allocatedQuantity.toString()
  );
  const [isFocused, setIsFocused] = useState<boolean>(false);

  useEffect(() => {
    if (!isFocused) {
      setLocalValue(allocation.allocatedQuantity.toString());
    }
  }, [allocation.allocatedQuantity, isFocused]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    setIsFocused(false);
    const v = parseInt(localValue, 10);
    if (!isNaN(v)) {
      onAllocationChange(index, v);
    } else {
      setLocalValue(allocation.allocatedQuantity.toString());
    }
  };

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 1 }}>
      <TextField
        label="Warehouse"
        value={warehouseName}
        InputProps={{ readOnly: true, sx: { cursor: "pointer" } }}
        onClick={onOpenWarehouse}
        fullWidth
      />
      <TextField
      
        label="Allocated Quantity"
        type="number"
        value={localValue}
        onChange={handleChange}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        inputProps={{ min: 0 }}
        disabled={distributionMode === "equal"}
        error={!!allocationError}
        helperText={allocationError && index === 0 ? allocationError : ""}
        sx={{ width: 150 }}
      />
      {canRemove && (
        <IconButton onClick={onRemove} size="small">
          <DeleteIcon color="error" />
        </IconButton>
      )}
    </Box>
  );
};

export default StoreAllocationRow;
