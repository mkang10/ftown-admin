"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Warehouse } from "@/type/warehouse";

export interface VariantRowProps {
  index: number;
  costPrice: number;
  quantity: number;
  productDisplay: string;
  warehouses: Warehouse[];
  distributionMode: "equal" | "custom";
  errorMessage?: string;
  onVariantClick: (index: number) => void;
  onUnitPriceChange: (index: number, value: number) => void;
  onQuantityChange: (index: number, value: number) => void;
  onRemoveRow: (index: number) => void;
  onStoreIdChange: (
    variantIndex: number,
    allocationIndex: number,
    warehouseId: number
  ) => void;
  onAllocationChange: (
    variantIndex: number,
    allocationIndex: number,
    value: number
  ) => void;
  onAddStoreAllocation: (variantIndex: number) => void;
  onRemoveStoreAllocation: (
    variantIndex: number,
    allocationIndex: number
  ) => void;
}

const VariantRow: React.FC<VariantRowProps> = ({
  index,
  costPrice,
  quantity,
  productDisplay,
  warehouses,
  distributionMode,
  errorMessage,
  onVariantClick,
  onUnitPriceChange,
  onQuantityChange,
  onRemoveRow,
  onStoreIdChange,
  onAllocationChange,
  onAddStoreAllocation,
  onRemoveStoreAllocation,
}) => {
  const [localUnitPrice, setLocalUnitPrice] = useState(costPrice.toString());
  const [localQuantity, setLocalQuantity] = useState(quantity.toString());
  


  return (
    <Box
    sx={{
      p: 3,
      mb: 3,
      backgroundColor: "#ffffff",
      border: "0px solid #e0e0e0",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
      transition: "all 0.3s ease",
      "&:hover": {
        boxShadow: "0 6px 20px rgba(0, 0, 0, 0.08)",
      },
    }}
  >
  

      {errorMessage && (
        <Typography color="error" sx={{ mb: 2, fontWeight: 600 }}>
          {errorMessage}
        </Typography>
      )}

      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
      <Typography
  onClick={() => onVariantClick(index)}
  sx={{
    flex: 1,
    fontWeight: 600,
    textTransform: "none",
    fontSize: "1.1rem",
    color: "#222",
    cursor: "pointer",
    "&:hover": { textDecoration: "underline" },
  }}
>

  {productDisplay || "Chọn biến thể sản phẩm"}
</Typography>

        {index > 0 && (
      <IconButton
      onClick={() => onRemoveRow(index)}
      sx={{
        border: "0px solid #ccc",
        color: "#333",
        borderRadius: "10px",
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

      {/* Giá nhập & Số lượng */}
      <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
  {/* GIÁ NHẬP */}
  <TextField
    label="Giá nhập"
    variant="outlined"
    type="number"
    value={localUnitPrice}
    onChange={(e) => {
      const raw = e.target.value.replace(/[^0-9]/g, ""); // Loại bỏ ký tự đặc biệt
      const parsed = parseFloat(raw);
      const valid = isNaN(parsed) ? 0 : parsed;
      setLocalUnitPrice(valid.toString());
      onUnitPriceChange(index, valid * 1000);
    }}
    onKeyDown={(e) => {
      if (
        ["-", "+", "e", "E", ".", ",", "*", "/", "\\"].includes(e.key)
      ) {
        e.preventDefault();
      }
    }}
    fullWidth
    InputLabelProps={{
      style: { color: "#000", fontWeight: 600, letterSpacing: "0.5px" },
    }}
    InputProps={{
      endAdornment: (
        <InputAdornment position="end">VND (đơn vị nghìn)</InputAdornment>
      ),
      style: { fontWeight: 500 },
      inputProps: { min: 0 },
    }}
    sx={{
      backgroundColor: "#f8f8f8",
      borderRadius: 2,
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#fff" },
        "&:hover fieldset": { borderColor: "#444" },
        "&.Mui-focused fieldset": {
          borderColor: "#000",
          borderWidth: 1,
        },
      },
    }}
  />

  {/* SỐ LƯỢNG */}
  <TextField
    label="Số lượng"
    variant="outlined"
    type="number"
    value={localQuantity}
    onChange={(e) => {
      const raw = e.target.value.replace(/[^0-9]/g, "");
      const parsed = parseInt(raw, 10);
      const valid = isNaN(parsed) ? 0 : parsed;
      setLocalQuantity(valid.toString());
      onQuantityChange(index, valid);
    }}
    onKeyDown={(e) => {
      if (
        ["-", "+", "e", "E", ".", ",", "*", "/", "\\"].includes(e.key)
      ) {
        e.preventDefault();
      }
    }}
    fullWidth
    InputLabelProps={{
      style: { color: "#000", fontWeight: 600, letterSpacing: "0.5px" },
    }}
    InputProps={{
      style: { fontWeight: 500 },
      inputProps: { min: 0 },
    }}
    sx={{
      backgroundColor: "#f8f8f8",
      borderRadius: 2,
      "& .MuiOutlinedInput-root": {
        "& fieldset": { borderColor: "#fff" },
        "&:hover fieldset": { borderColor: "#444" },
        "&.Mui-focused fieldset": {
          borderColor: "#000",
          borderWidth: 1,
        },
      },
    }}
  />
</Box>



     

      

     
    </Box>
  );
};

export default VariantRow;
