"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  Paper,
  Button,
  Snackbar,
  Alert,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProductVariantDialogSelect from "./ProductVariantDialogSelect";
import VariantRow from "./VariantRow";
import { InventoryImportCreateRequest } from "@/type/CreateInventoryImport";
import { Warehouse } from "@/type/warehouse";
import { productVariant } from "@/type/Product";

const availableWarehouses: Warehouse[] = [
  { warehouseId: 1, warehouseName: "Warehouse 1", shopManagerId: 101 },
  { warehouseId: 2, warehouseName: "Warehouse 2", shopManagerId: 102 },
];

export interface CreateInventoryImportModalFormProps {
  formData: InventoryImportCreateRequest;
  onProductVariantChange: (variantId: number, rowIndex: number) => void;
  onChange: React.Dispatch<React.SetStateAction<InventoryImportCreateRequest>>;
  onSubmit: (e: React.FormEvent) => void;
  loading: boolean;
  onQuantityChange: (index: number, value: number) => void;
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
}

const CreateInventoryImportModalForm: React.FC<CreateInventoryImportModalFormProps> = ({
  formData,
  onProductVariantChange,
  onChange,
  onSubmit,
  loading,
  onQuantityChange,
  onStoreIdChange,
  onAllocationChange,
}) => {
  const [mode, setMode] = useState<"custom" | "equal">("custom");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(0);
  const [productDisplay, setProductDisplay] = useState<string[]>(
    formData.importDetails.map(() => "")
  );
  const [notification, setNotification] = useState("");
  const [validationError, setValidationError] = useState<string>("");
  const [variantErrors, setVariantErrors] = useState<string[]>(
    formData.importDetails.map(() => "")
  );
  
  // Sync display names
  useEffect(() => {
    setProductDisplay((prev) => {
      const arr = [...prev];
      while (arr.length < formData.importDetails.length) arr.push("");
      while (arr.length > formData.importDetails.length) arr.pop();
      return arr;
    });
  }, [formData.importDetails.length]);

  // When switch to equal, split quantities
  useEffect(() => {
    if (mode === "equal") {
      onChange((prev) => ({
        ...prev,
        importDetails: prev.importDetails.map((d) => {
          const per = d.storeDetails.length
            ? Math.floor(d.quantity / d.storeDetails.length)
            : 0;
          return {
            ...d,
            storeDetails: d.storeDetails.map((s) => ({
              ...s,
              allocatedQuantity: per,
            })),
          };
        }),
      }));
    }
  }, [mode]);

  // Validate sum vs quantity
  useEffect(() => {
    for (let i = 0; i < formData.importDetails.length; i++) {
      const { quantity, storeDetails } = formData.importDetails[i];
      const total = storeDetails.reduce((s, a) => s + a.allocatedQuantity, 0);
      if (total !== quantity) {
        setValidationError(`Row ${i + 1}: tổng ${total} ≠ ${quantity}`);
        return;
      }
    }
    setValidationError("");
  }, [formData]);

  useEffect(() => {
    if (mode === "equal") {
      onChange(prev => ({
        ...prev,
        importDetails: prev.importDetails.map(d => {
          // Lấy quantity mới từ prev
          const qty = d.quantity;
          const per = d.storeDetails.length
            ? Math.floor(qty / d.storeDetails.length)
            : 0;
          return {
            ...d,
            storeDetails: d.storeDetails.map(s => ({
              ...s,
              allocatedQuantity: per,
            })),
          };
        }),
      }));
    }
  }, [
    mode,
    // Thêm phụ thuộc vào tất cả quantity
    ...formData.importDetails.map(d => d.quantity),
  ]);
  
  const handleAddRow = () => {
    onChange((prev) => ({
      ...prev,
      importDetails: [
        ...prev.importDetails,
        {
          productVariantId: 0,
          unitPrice: 0,
          quantity: 0,
          storeDetails: [{ wareHouseId: 0, allocatedQuantity: 0, handleBy: null }],
        },
      ],
    }));
  };

  const handleVariantSelect = (variant: productVariant) => {
    // Kiểm tra trùng
    const isDup = formData.importDetails.some(
      (d, i) => i !== selectedRow && d.productVariantId === variant.variantId
    );
    if (isDup) {
      // Gán lỗi cho row
      setVariantErrors((prev) => {
        const arr = [...prev];
        arr[selectedRow] = "Variant already selected";
        return arr;
      });
      return;
    }
    // Clear lỗi
    setVariantErrors((prev) => {
      const arr = [...prev];
      arr[selectedRow] = "";
      return arr;
    });
    // Cập nhật variantId
    onChange((prev) => ({
      ...prev,
      importDetails: prev.importDetails.map((d, i) =>
        i === selectedRow ? { ...d, productVariantId: variant.variantId } : d
      ),
    }));
    // Cập nhật display
    setProductDisplay((prev) => {
      const arr = [...prev];
      arr[selectedRow] = `${variant.productName} - ${variant.sizeName} - ${variant.colorName}`;
      return arr;
    });
    onProductVariantChange(variant.variantId, selectedRow);
    setOpenDialog(false);
  };
  return (
    <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 4, background: "#fafafa" }}>
      <Box
        component="form"
        onSubmit={(e) => {
          if (validationError) {
            e.preventDefault();
            setNotification(validationError);
          } else {
            onSubmit(e);
          }
        }}
        sx={{ display: "flex", flexDirection: "column", gap: 3 }}
      >
        <Typography variant="h6">Create Inventory Import</Typography>

        {/* Mode selector */}
        <RadioGroup
          row
          value={mode}
          onChange={(e) => setMode(e.target.value as any)}
          sx={{ gap: 2 }}
        >
          <FormControlLabel value="custom" control={<Radio />} label="Custom" />
          <FormControlLabel value="equal" control={<Radio />} label="Equal Split" />
        </RadioGroup>

        {/* Variant rows */}
        {formData.importDetails.map((detail, idx) => (
          <VariantRow
            key={idx}
            index={idx}
            unitPrice={detail.unitPrice}
            quantity={detail.quantity}
            productDisplay={productDisplay[idx]}
            storeAllocations={detail.storeDetails}
            warehouses={availableWarehouses}
            distributionMode={mode}
            errorMessage={variantErrors[idx]}

            onVariantClick={() => {
              setSelectedRow(idx);
              setOpenDialog(true);
            }}
            onUnitPriceChange={(i, v) =>
              onChange((prev) => {
                const d = [...prev.importDetails];
                d[i].unitPrice = v;
                return { ...prev, importDetails: d };
              })
            }
            onQuantityChange={(i, v) =>
              onChange((prev) => {
                const d = [...prev.importDetails];
                d[i].quantity = v;
                return { ...prev, importDetails: d };
              })
            }
            onRemoveRow={(i) =>
              onChange((prev) => ({
                ...prev,
                importDetails: prev.importDetails.filter((_, j) => j !== i),
              }))
            }
            onStoreIdChange={(i, a, w) => onStoreIdChange(i, a, w)}
            onAllocationChange={(i, a, v) => onAllocationChange(i, a, v)}
            onAddStoreAllocation={(i) =>
              onChange((prev) => {
                const d = [...prev.importDetails];
                d[i].storeDetails.push({ wareHouseId: 0, allocatedQuantity: 0, handleBy: null });
                return { ...prev, importDetails: d };
              })
            }
            onRemoveStoreAllocation={(i, a) =>
              onChange((prev) => {
                const d = [...prev.importDetails];
                d[i].storeDetails = d[i].storeDetails.filter((_, j) => j !== a);
                return { ...prev, importDetails: d };
              })
            }
          />
        ))}

        {/* Add product button */}
        <Button
          onClick={handleAddRow}
          variant="outlined"
          startIcon={<AddIcon />}
          sx={{ alignSelf: "flex-start" }}
        >
          Add Product
        </Button>

        <Divider />

        {/* Submit */}
        <Box sx={{ textAlign: "right" }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading}
            sx={{ px: 5, py: 1.5, borderRadius: 2 }}
          >
            {loading ? "Processing..." : "Create Import"}
          </Button>
        </Box>
      </Box>

      <ProductVariantDialogSelect
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSelect={handleVariantSelect}
        selectedVariantIds={formData.importDetails.map((d) => d.productVariantId)}

      />

      <Snackbar
        open={!!notification}
        autoHideDuration={4000}
        onClose={() => setNotification("")}
      >
        <Alert severity="error">{notification}</Alert>
      </Snackbar>
    </Paper>
  );
};

export default CreateInventoryImportModalForm;
