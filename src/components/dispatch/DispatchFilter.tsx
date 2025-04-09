import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
} from "@mui/material";

export type FilterData = {
  Status?: string;
  ReferenceNumber?: string;
  FromDate?: string;
  ToDate?: string;
  WarehouseId?: string;
  StaffId?: string;
};

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filters: FilterData) => void;
  initialFilters: FilterData;
}

export default function FilterDispatchDialog({
  open,
  onClose,
  onSubmit,
  initialFilters,
}: FilterDialogProps) {
  const [filters, setFilters] = useState<FilterData>(initialFilters);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    onSubmit(filters);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Lọc Dispatch</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={6}>
            <TextField
              label="Status"
              name="Status"
              fullWidth
              value={filters.Status || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Reference Number"
              name="ReferenceNumber"
              fullWidth
              value={filters.ReferenceNumber || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="From Date"
              name="FromDate"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.FromDate || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="To Date"
              name="ToDate"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filters.ToDate || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Warehouse ID"
              name="WarehouseId"
              fullWidth
              value={filters.WarehouseId || ""}
              onChange={handleChange}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Staff ID"
              name="StaffId"
              fullWidth
              value={filters.StaffId || ""}
              onChange={handleChange}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
