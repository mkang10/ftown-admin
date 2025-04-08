"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import toast from "react-hot-toast";
import { filterTransfers } from "@/ultis/transferapi";

interface CreateTransferModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTransferModal: React.FC<CreateTransferModalProps> = ({ open, onClose, onSuccess }) => {
  const [sourceWarehouse, setSourceWarehouse] = useState("");
  const [destinationWarehouse, setDestinationWarehouse] = useState("");
  const [transferDate, setTransferDate] = useState("");

  const handleSubmit = async () => {
    try {
      const payload = { sourceWarehouse, destinationWarehouse, transferDate };
      const result = await filterTransfers(payload);
      if(result.status) {
         toast.success("Transfer created successfully");
         onSuccess();
         onClose();
      } else {
         toast.error(result.message || "Failed to create transfer");
      }
    } catch (error) {
      console.error("Error creating transfer:", error);
      toast.error("An error occurred while creating transfer");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Create Transfer</DialogTitle>
      <DialogContent>
        <TextField
          label="Source Warehouse"
          value={sourceWarehouse}
          onChange={(e) => setSourceWarehouse(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Destination Warehouse"
          value={destinationWarehouse}
          onChange={(e) => setDestinationWarehouse(e.target.value)}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Transfer Date"
          type="datetime-local"
          value={transferDate}
          onChange={(e) => setTransferDate(e.target.value)}
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Create</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTransferModal;
