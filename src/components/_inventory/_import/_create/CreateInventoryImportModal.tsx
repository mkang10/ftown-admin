"use client";
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, Alert, Box } from "@mui/material";
import { useRouter } from "next/navigation";
import CreateInventoryImportModalHeader from "./CreateInventoryImportModalHeader";
import CreateInventoryImportModalForm from "./CreateInventoryImportModalForm";
import { createInventoryImport } from "@/ultis/importapi";
import { toast } from "react-toastify";
import {
  InventoryImportCreateRequest,
  InventoryImportCreateResponse,
} from "@/type/CreateInventoryImport";

interface CreateInventoryImportModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateInventoryImportModal: React.FC<CreateInventoryImportModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<InventoryImportCreateRequest>({
    createdBy: 0,
    handleBy: 0,
    originalImportId: null,
    importDetails: [
      {
        productVariantId: 0,
        costPrice: 0,
        quantity: 0,
        storeDetails: [{ wareHouseId: 0, allocatedQuantity: 0, handleBy: null }],
      },
    ],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      const account = JSON.parse(localStorage.getItem("account") || "{}");
      setFormData((prev) => ({
        ...prev,
        createdBy: account.accountId || 0,
        handleBy: account.roleDetails?.shopManagerDetailId || 0,
      }));
    }
  }, [open]);

  const handleProductVariantChange = (variantId: number, rowIndex: number) => {
    setFormData((prev) => ({
      ...prev,
      importDetails: prev.importDetails.map((d, i) =>
        i === rowIndex ? { ...d, productVariantId: variantId } : d
      ),
    }));
  };

  const handleStoreIdChange = (
    variantIndex: number,
    allocationIndex: number,
    warehouseId: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      importDetails: prev.importDetails.map((d, i) => {
        if (i !== variantIndex) return d;
        return {
          ...d,
          storeDetails: d.storeDetails.map((s, j) =>
            j === allocationIndex ? { ...s, wareHouseId: warehouseId } : s
          ),
        };
      }),
    }));
  };

  const handleAllocationChange = (
    variantIndex: number,
    allocationIndex: number,
    value: number
  ) => {
    setFormData((prev) => ({
      ...prev,
      importDetails: prev.importDetails.map((d, i) => {
        if (i !== variantIndex) return d;
        return {
          ...d,
          storeDetails: d.storeDetails.map((s, j) =>
            j === allocationIndex ? { ...s, allocatedQuantity: value } : s
          ),
        };
      }),
    }));
  };

  const handleQuantityChange = (index: number, value: number) => {
    setFormData((prev) => ({
      ...prev,
      importDetails: prev.importDetails.map((d, i) =>
        i === index ? { ...d, quantity: value } : d
      ),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const data: InventoryImportCreateResponse = await createInventoryImport(formData);
      if (data.status) {
        toast.success("Inventory import created successfully!");
        onClose();
        onSuccess();
      } else {
        toast.error(data.message || "Failed to create import");
        setError(data.message);
      }
    } catch {
      toast.error("Error creating inventory import");
      setError("Error creating inventory import");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <CreateInventoryImportModalHeader />
      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        <CreateInventoryImportModalForm
          formData={formData}
          onProductVariantChange={handleProductVariantChange}
          onChange={setFormData}
          onSubmit={handleSubmit}
          loading={loading}
          onQuantityChange={handleQuantityChange}
          onStoreIdChange={handleStoreIdChange}
          onAllocationChange={handleAllocationChange}
        />
      </DialogContent>
    </Dialog>
  );
};

export default CreateInventoryImportModal;
