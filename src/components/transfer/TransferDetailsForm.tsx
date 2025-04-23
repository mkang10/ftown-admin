"use client";
import React, { useState } from "react";
import { Box, Typography, IconButton, Button, TextField } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import ProductVariantDialogSelect from "../_inventory/_import/_create/ProductVariantDialogSelect";
import { productVariant } from "@/type/Product";

export interface TransferDetail {
  variantId: number;
  quantity: number;
  costPrice: number;
}

interface TransferDetailsFormProps {
  index: number;
  detail: TransferDetail;
  onChange: (updated: TransferDetail) => void;
  onRemove: () => void;
  selectedVariantIds: number[]; // ✅ Thêm prop này
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
    const value = event.target.value;
    // Nếu input rỗng, bạn có thể đặt giá trị về 0 hoặc không làm gì.
    if (value === "") {
      onChange({ ...detail, [field]: 0 });
      return;
    }

    const numericValue = Number(value);
    // Kiểm tra số âm và số có dấu
    if (numericValue < 0 || !Number.isInteger(numericValue)) {
      return;
    }
    onChange({ ...detail, [field]: numericValue });
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
        inputProps={{ min: 0, step: 1 }}
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
