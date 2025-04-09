"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Divider,
} from "@mui/material";
import WarehouseSelectDialog from "./WarehouseSelectDialog";
import TransferDetailsForm from "./TransferDetailsForm";
import toast from "react-hot-toast";
import { createTransfer } from "@/ultis/transferapi";
import { TransferCreateRequest, TransferDetail } from "@/type/CreateTransfer";
import { Warehouse } from "@/type/warehouse";

interface CreateTransferModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTransferModal: React.FC<CreateTransferModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [createdBy] = useState<number>(18);
  const [sourceWarehouse, setSourceWarehouse] = useState<Warehouse | null>(null);
  const [destinationWarehouse, setDestinationWarehouse] = useState<Warehouse | null>(null);
  const [transferDetails, setTransferDetails] = useState<TransferDetail[]>([
    { variantId: 0, quantity: 0, unitPrice: 0 },
  ]);

  const handleDetailChange = (index: number, updated: TransferDetail) => {
    const newDetails = [...transferDetails];
    newDetails[index] = updated;
    setTransferDetails(newDetails);
  };

  const handleRemoveDetail = (index: number) => {
    const newDetails = transferDetails.filter((_, i) => i !== index);
    setTransferDetails(newDetails);
  };

  const handleAddDetail = () => {
    setTransferDetails([
      ...transferDetails,
      { variantId: 0, quantity: 0, unitPrice: 0 },
    ]);
  };

  const handleSubmit = async () => {
    if (!sourceWarehouse || !destinationWarehouse) {
      toast.error("Please select both Source and Destination Warehouses.");
      return;
    }

    const payload: TransferCreateRequest = {
      createdBy,
      sourceWarehouseId: sourceWarehouse.warehouseId,
      destinationWarehouseId: destinationWarehouse.warehouseId,
      transferDetails,
    };

    try {
      const result = await createTransfer(payload);
      toast.success(result.message);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error creating transfer:", error);
      toast.error("An error occurred while creating transfer");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Transfer</DialogTitle>
      <DialogContent>
        <Box sx={{ my: 2 }}>
          <WarehouseSelectDialog
            label="Source Warehouse"
            selectedWarehouse={sourceWarehouse || undefined}
            onSelect={setSourceWarehouse}
          />
        </Box>
        <Divider />
        <Box sx={{ my: 2 }}>
          <WarehouseSelectDialog
            label="Destination Warehouse"
            selectedWarehouse={destinationWarehouse || undefined}
            onSelect={setDestinationWarehouse}
          />
        </Box>
        <Divider />
        <Box sx={{ my: 2 }}>
          {transferDetails.map((detail, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <TransferDetailsForm
                index={idx}
                detail={detail}
                onChange={(updated) => handleDetailChange(idx, updated)}
                onRemove={() => handleRemoveDetail(idx)}
              />
            </Box>
          ))}
          <Button variant="outlined" onClick={handleAddDetail} fullWidth>
            + Add Another Variant
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTransferModal;
