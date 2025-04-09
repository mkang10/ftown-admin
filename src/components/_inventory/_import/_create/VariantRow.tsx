"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import WarehouseDialogSelect from "./WareHouseDialogSelect";
import StoreAllocationList from "./StoreAllocationList";
import { StoreAllocation } from "./StoreAllocationRow";
import { Warehouse } from "@/type/warehouse";

export interface VariantRowProps {
  index: number;
  unitPrice: number;
  quantity: number;
  productDisplay: string;
  storeAllocations: StoreAllocation[];
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
  unitPrice,
  quantity,
  productDisplay,
  storeAllocations,
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
  const [localUnitPrice, setLocalUnitPrice] = useState(unitPrice.toString());
  const [localQuantity, setLocalQuantity] = useState(quantity.toString());
  const [warehouseNames, setWarehouseNames] = useState<string[]>(
    storeAllocations.map(() => "")
  );
  const [openWarehouseDialog, setOpenWarehouseDialog] = useState(false);
  const [selectedAllocationIndex, setSelectedAllocationIndex] = useState(0);

  // Sync warehouseNames array length & reset names whenever allocations change
// Cập nhật warehouseNames theo storeAllocations và danh sách warehouses
useEffect(() => {
  setWarehouseNames(
    storeAllocations.map((alloc) => {
      const found = warehouses.find(
        (w) => w.warehouseId === alloc.wareHouseId
      );
      return found?.warehouseName || "";
    })
  );
}, [storeAllocations, warehouses]);


  // Compute allocation error on the fly
  const parsedQty = parseInt(localQuantity, 10) || 0;
  const totalAllocated = storeAllocations.reduce(
    (sum, a) => sum + a.allocatedQuantity,
    0
  );
  let allocationError = "";
  if (distributionMode === "custom") {
    if (totalAllocated < parsedQty) {
      allocationError = `Sản phẩm phân bổ (${totalAllocated}) < tổng sản phẩm (${parsedQty})`;
    } else if (totalAllocated > parsedQty) {
      allocationError = `Sản phẩm phân bổ (${totalAllocated}) > tổng sản phẩm (${parsedQty})`;
    }
  }

  const handleStoreSelect = (warehouse: Warehouse) => {
    onStoreIdChange(index, selectedAllocationIndex, warehouse.warehouseId);
    setWarehouseNames((prev) => {
      const arr = [...prev];
      arr[selectedAllocationIndex] = warehouse.warehouseName;
      return arr;
    });
    setOpenWarehouseDialog(false);
  };

  return (
    <Box sx={{ border: "1px solid #ddd", p: 2, borderRadius: 1, mb: 2 }}>
      {errorMessage && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {errorMessage}
        </Alert>
      )}

      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography
          onClick={() => onVariantClick(index)}
          sx={{ cursor: "pointer", fontWeight: "bold", flex: 1 }}
        >
          {productDisplay || "Select variant"}
        </Typography>
        {index > 0 && (
          <IconButton onClick={() => onRemoveRow(index)} size="small">
            <DeleteIcon color="error" />
          </IconButton>
        )}
      </Box>

      {/* Unit price & quantity */}
      <Box sx={{ mt: 2, display: "flex", gap: 2 }}>
        <TextField
          label="Unit Price"
          type="number"
          value={localUnitPrice}
          onChange={(e) => {
            const v = e.target.value;
            setLocalUnitPrice(v);
            onUnitPriceChange(index, parseFloat(v) || 0);
          }}
          fullWidth
        />
        <TextField
          label="Quantity"
          type="number"
          value={localQuantity}
          onChange={(e) => {
            const v = e.target.value;
            setLocalQuantity(v);
            onQuantityChange(index, parseInt(v, 10) || 0);
          }}
          fullWidth
        />
      </Box>

      {/* Allocation error */}
      {distributionMode === "custom" && allocationError && (
        <Typography color="error" sx={{ mt: 1 }}>
          {allocationError}
        </Typography>
      )}

      {/* Store allocation list */}
      <StoreAllocationList
        allocations={storeAllocations}
        warehouseNames={warehouseNames}
        distributionMode={distributionMode}
        allocationError={allocationError}
        onAllocationChange={(aIdx, val) =>
          onAllocationChange(index, aIdx, val)
        }
        onRemoveStoreAllocation={(aIdx) =>
          onRemoveStoreAllocation(index, aIdx)
        }
        onAddStoreAllocation={() => onAddStoreAllocation(index)}
        onOpenWarehouse={(aIdx) => {
          setSelectedAllocationIndex(aIdx);
          setOpenWarehouseDialog(true);
        }}
      />

      {/* Warehouse selection dialog */}
      <WarehouseDialogSelect
        open={openWarehouseDialog}
        onClose={() => setOpenWarehouseDialog(false)}
        onSelect={handleStoreSelect}
      />
    </Box>
  );
};

export default VariantRow;
