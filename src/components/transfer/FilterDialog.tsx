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

export interface FilterData {
  filter?: string;
}

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filters: FilterData) => void;
  initialFilters: FilterData;
}

const FilterDialog: React.FC<FilterDialogProps> = ({ open, onClose, onSubmit, initialFilters }) => {
  const [filter, setFilter] = useState<string>(initialFilters.filter || "");

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
