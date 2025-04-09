"use client";
import React, { useState } from "react";
import { Box, Typography, IconButton, Button, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ProductVariantDialogSelect from "../_inventory/_import/_create/ProductVariantDialogSelect";
import { productVariant } from "@/type/Product";

export interface TransferDetail {
  variantId: number;
  quantity: number;
  unitPrice: number;
}

interface TransferDetailsFormProps {
  index: number;
  detail: TransferDetail;
  onChange: (updated: TransferDetail) => void;
  onRemove: () => void;
}

const TransferDetailsForm: React.FC<TransferDetailsFormProps> = ({
  index,
  detail,
  onChange,
  onRemove,
}) => {
  const [openVariantDialog, setOpenVariantDialog] = useState(false);
  const [variantDisplay, setVariantDisplay] = useState<string>("");

  const handleFieldChange = (field: keyof TransferDetail) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({ ...detail, [field]: Number(event.target.value) });
  };

  const handleVariantSelect = (variant: productVariant) => {
    onChange({ ...detail, variantId: variant.variantId });
    setVariantDisplay(`${variant.productName} - ${variant.sizeName} - ${variant.colorName}`);
  };

  return (
    <Box
      sx={{
        border: "1px solid #ddd",
        borderRadius: 2,
        p: 2,
        position: "relative",
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="subtitle1">Chi tiết {index + 1}</Typography>
        <IconButton onClick={onRemove}>
          <DeleteIcon color="error" />
        </IconButton>
      </Box>

      <Box display="flex" alignItems="center" gap={2} mt={2}>
        <Button variant="outlined" onClick={() => setOpenVariantDialog(true)}>
          {variantDisplay || "Chọn sản phẩm"}
        </Button>
        {detail.variantId !== 0 && (
          <Typography variant="caption" color="text.secondary">
            ID: {detail.variantId}
          </Typography>
        )}
      </Box>

      <TextField
        label="Quantity"
        type="number"
        value={detail.quantity}
        onChange={handleFieldChange("quantity")}
        fullWidth
        margin="normal"
      />
      <TextField
        label="Unit Price"
        type="number"
        value={detail.unitPrice}
        onChange={handleFieldChange("unitPrice")}
        fullWidth
        margin="normal"
      />

      <ProductVariantDialogSelect
        open={openVariantDialog}
        onClose={() => setOpenVariantDialog(false)}
        onSelect={handleVariantSelect}
        selectedVariantIds={[detail.variantId]}
      />
    </Box>
  );
};

export default TransferDetailsForm;
