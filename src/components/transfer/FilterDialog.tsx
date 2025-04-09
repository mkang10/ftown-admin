"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
} from "@mui/material";
import { TransferFilterData } from "@/type/transfer";

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filters: TransferFilterData) => void;
  initialFilters: TransferFilterData;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ open, onClose, onSubmit, initialFilters }) => {
  const [filter, setFilter] = useState<string>(initialFilters.filter || "");

  useEffect(() => {
    setFilter(initialFilters.filter || "");
  }, [initialFilters]);

  const handleSubmit = () => {
    onSubmit({ filter });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Filter Transfers</DialogTitle>
      <DialogContent>
        <TextField
          label="Filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          fullWidth
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">Apply</Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
