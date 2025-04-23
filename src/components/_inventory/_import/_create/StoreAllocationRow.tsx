"use client";
import React, { useState, useEffect } from "react";
import { Box, TextField, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export interface StoreAllocation {
  wareHouseId: number;
  allocatedQuantity: number;
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
    setLocalValue(e.target.value.replace(/[^0-9]/g, ""));
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
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 2,
        mb: 2,
        p: 2,
        backgroundColor: "#ffffff",
        border: "1px solid #e0e0e0",
        borderRadius: "12px",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 4px 16px rgba(0, 0, 0, 0.06)",
        },
      }}
    >
      {/* Kho */}
      <TextField
        label="Kho"
        value={warehouseName}
        onClick={onOpenWarehouse}
        fullWidth
        InputProps={{
          readOnly: true,
          sx: {
            cursor: "pointer",
            color: "#222",
            backgroundColor: "#fafafa",
            borderRadius: 2,
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#e0e0e0",
            },
            "&:hover .MuiOutlinedInput-notchedOutline": {
              borderColor: "#999",
            },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              borderColor: "#000",
              borderWidth: 1.5,
            },
          },
        }}
        InputLabelProps={{
          style: { color: "#333", fontWeight: 600, letterSpacing: "0.5px" },
        }}
        sx={{ borderRadius: 2 }}
      />

      {/* Số lượng phân bổ */}
      <Box hidden sx={{ width: 150 }}>
        <TextField 
          label="Số lượng"
          type="number"
          value={localValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={handleBlur}
          inputProps={{ min: 0, style: { color: "#222" } }}
          disabled={distributionMode === "equal"}
          error={!!allocationError}
          helperText={allocationError && index === 0 ? allocationError : ""}
          fullWidth
          InputLabelProps={{
            style: { color: "#333", fontWeight: 600, letterSpacing: "0.5px" },
          }}
          sx={{
            backgroundColor: "#fafafa",
            borderRadius: 2,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#e0e0e0" },
              "&:hover fieldset": { borderColor: "#999" },
              "&.Mui-focused fieldset": {
                borderColor: "#000",
                borderWidth: 1.5,
              },
            },
          }}
        />
      </Box>

      {/* Nút xóa phân bổ nếu cho phép */}
      {canRemove && (
        <IconButton
          onClick={onRemove}
          sx={{
            border: "1px solid #ccc",
            color: "#333",
            borderRadius: "10px",
            transition: "all 0.3s ease",
            "&:hover": {
              backgroundColor: "#000",
              color: "#fff",
            },
          }}
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      )}
    </Box>
  );
};

export default StoreAllocationRow;
