"use client";
import React from "react";
import {
  Box,
  TextField,
  IconButton,
  Grid,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export interface TransferDetail {
  variantId: number;
  quantity: number;
  unitPrice: number;
}

interface TransferDetailRowProps {
  detail: TransferDetail;
  onChange: (detail: TransferDetail) => void;
  onRemove?: () => void;
}

const TransferDetailRow: React.FC<TransferDetailRowProps> = ({
  detail,
  onChange,
  onRemove,
}) => {
  const handleChange = (field: keyof TransferDetail) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({ ...detail, [field]: Number(e.target.value) });
  };

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 1,
        p: 2,
        mb: 2,
        position: "relative",
      }}
    >
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField
            label="Variant ID"
            type="number"
            value={detail.variantId}
            onChange={handleChange("variantId")}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Quantity"
            type="number"
            value={detail.quantity}
            onChange={handleChange("quantity")}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            label="Cost Price"
            type="hidden"
            value={detail.unitPrice}
            onChange={handleChange("unitPrice")}
            fullWidth
          />
        </Grid>
      </Grid>

      {onRemove && (
        <IconButton
          onClick={onRemove}
          size="small"
          sx={{ position: "absolute", top: 8, right: 8 }}
        >
          <DeleteIcon color="error" />
        </IconButton>
      )}
    </Box>
  );
};

export default TransferDetailRow;
