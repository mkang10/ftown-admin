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
import { getWarehouses } from "@/ultis/importapi";

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
  // Khai báo state để lưu warehouses lấy từ API
  const [availableWarehouses, setAvailableWarehouses] = useState<Warehouse[]>([]);
  const [mode, setMode] = useState<"custom" | "equal">("equal");
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

  // Gọi API lấy danh sách Warehouse thông qua hàm getWarehouses
  useEffect(() => {
    const fetchWarehouses = async () => {
      try {
        // Gọi hàm getWarehouses() với các tham số nếu cần
        const result = await getWarehouses(); // mặc định page=1, pageSize=5
        setAvailableWarehouses(result.data);
      } catch (error) {
        console.error("Failed to fetch warehouses:", error);
      }
    };
    fetchWarehouses();
  }, []);

  // 1. Sync productDisplay length to match importDetails
  useEffect(() => {
    setProductDisplay((prev) => {
      const arr = [...prev];
      while (arr.length < formData.importDetails.length) arr.push("");
      while (arr.length > formData.importDetails.length) arr.pop();
      return arr;
    });
    setVariantErrors((prev) => {
      const arr = [...prev];
      while (arr.length < formData.importDetails.length) arr.push("");
      while (arr.length > formData.importDetails.length) arr.pop();
      return arr;
    });
  }, [formData.importDetails.length]);

  // 2. When mode = "equal" or importDetails change, auto-split quantities equally
  useEffect(() => {
    if (mode !== "equal") return;

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
  }, [mode, formData.importDetails, onChange]);

  // 3. Validate sum of allocations vs. quantity on every importDetails change
  useEffect(() => {
    for (let i = 0; i < formData.importDetails.length; i++) {
      const { quantity, storeDetails } = formData.importDetails[i];
      const total = storeDetails.reduce((sum, s) => sum + s.allocatedQuantity, 0);
      if (total !== quantity) {
        setValidationError(`Row ${i + 1}: tổng ${total} ≠ ${quantity}`);
        return;
      }
    }
    setValidationError("");
  }, [formData.importDetails]);

  // Add a new empty row
  const handleAddRow = () => {
    onChange((prev) => ({
      ...prev,
      importDetails: [
        ...prev.importDetails,
        {
          productVariantId: 0,
          costPrice: 0,
          quantity: 0,
          storeDetails: [{ wareHouseId: 0, allocatedQuantity: 0, handleBy: null }],
        },
      ],
    }));
  };

  // When user selects a variant from the dialog
  const handleVariantSelect = (variant: productVariant) => {
    // Check duplicate
    const isDup = formData.importDetails.some(
      (d, idx) => idx !== selectedRow && d.productVariantId === variant.variantId
    );
    if (isDup) {
      setVariantErrors((prev) => {
        const arr = [...prev];
        arr[selectedRow] = "Variant already selected";
        return arr;
      });
      return;
    }

    // Clear any previous error
    setVariantErrors((prev) => {
      const arr = [...prev];
      arr[selectedRow] = "";
      return arr;
    });

    // Update variantId in formData
    onChange((prev) => ({
      ...prev,
      importDetails: prev.importDetails.map((d, idx) =>
        idx === selectedRow ? { ...d, productVariantId: variant.variantId } : d
      ),
    }));

    // Update display name
    setProductDisplay((prev) => {
      const arr = [...prev];
      arr[selectedRow] = `${variant.productName} - ${variant.sizeName} - ${variant.colorName}`;
      return arr;
    });

    // Notify parent to load details if needed
    onProductVariantChange(variant.variantId, selectedRow);
    setOpenDialog(false);
  };

  return (
    <Paper
    sx={{
      p: 4,
      borderRadius: 2,
      backgroundColor: "#fff",
      border: "2px solid black",
      boxShadow: "none",
    }}
  >
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
<Typography variant="h5" fontWeight="bold" color="black">
  Tạo Phiếu Nhập Kho
</Typography>

<RadioGroup
  row
  value={mode}
  onChange={(e) => setMode(e.target.value as "custom" | "equal")}
  sx={{ gap: 3, color: "black", display: "none" }} // <- Ẩn tại đây
>
  <FormControlLabel
    value="custom"
    control={<Radio sx={{ color: "black" }} />}
    label="Phân phối thủ công"
  />
  <FormControlLabel
    value="equal"
    control={<Radio sx={{ color: "black" }} />}
    label="Chia đều tự động"
  />
</RadioGroup>


        {/* Variant rows */}
        {formData.importDetails.map((detail, idx) => (
          <VariantRow
            key={idx}
            index={idx}
            costPrice={detail.costPrice}
            quantity={detail.quantity}
            productDisplay={productDisplay[idx]}
            warehouses={availableWarehouses}
            distributionMode={mode}
            errorMessage={variantErrors[idx]}
            onVariantClick={() => {
              setSelectedRow(idx);
              setOpenDialog(true);
            }}
            onUnitPriceChange={(i, v) =>
              onChange((prev) => {
                const arr = [...prev.importDetails];
                arr[i].costPrice = v;
                return { ...prev, importDetails: arr };
              })
            }
            onQuantityChange={(i, v) => onQuantityChange(i, v)}
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
                const arr = [...prev.importDetails];
                arr[i].storeDetails.push({ wareHouseId: 0, allocatedQuantity: 0, handleBy: null });
                return { ...prev, importDetails: arr };
              })
            }
            onRemoveStoreAllocation={(i, a) =>
              onChange((prev) => {
                const arr = [...prev.importDetails];
                arr[i].storeDetails = arr[i].storeDetails.filter((_, j) => j !== a);
                return { ...prev, importDetails: arr };
              })
            }
          />
        ))}

        {/* Add product button */}
        <Button
  onClick={handleAddRow}
  variant="outlined"
  startIcon={<AddIcon />}
  sx={{
    borderColor: "black",
    color: "black",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#000",
      color: "#fff",
    },
  }}
>
  Thêm sản phẩm
</Button>


        <Divider />

        {/* Submit */}
        <Box sx={{ textAlign: "right" }}>
        <Button
  type="submit"
  variant="contained"
  color="inherit"
  disabled={loading}
  sx={{
    px: 5,
    py: 1.5,
    borderRadius: 0,
    fontWeight: "bold",
    backgroundColor: "black",
    color: "white",
    transition: "0.3s ease",
    "&:hover": {
      backgroundColor: "#ffffff",
      color: "#000000",
      border: "2px solid black",
    },
    "&:disabled": {
      backgroundColor: "#ccc",
      color: "#666",
    },
  }}
>
  {loading ? "Đang tạo..." : "Tạo Phiếu Nhập"}
</Button>

        </Box>
      </Box>

      {/* Variant select dialog */}
      <ProductVariantDialogSelect
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        onSelect={handleVariantSelect}
        selectedVariantIds={formData.importDetails.map((d) => d.productVariantId)}
      />

      {/* Error notification */}
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
