"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem, // Import thêm MenuItem cho select
} from "@mui/material";

export interface FilterData {
  [key: string]: any;
}

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filters: FilterData) => void;
  initialFilters?: FilterData;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialFilters = {},
}) => {
  const [status, setStatus] = useState(initialFilters.Status || "");
  const [createdBy, setCreatedBy] = useState(initialFilters.CreatedBy || "");
  const [createdDateFrom, setCreatedDateFrom] = useState(initialFilters.CreatedDateFrom || "");
  const [createdDateTo, setCreatedDateTo] = useState(initialFilters.CreatedDateTo || "");
  const [referenceNumber, setReferenceNumber] = useState(initialFilters.ReferenceNumber || "");
  const [totalCostMin, setTotalCostMin] = useState(initialFilters.TotalCostMin || "");
  const [totalCostMax, setTotalCostMax] = useState(initialFilters.TotalCostMax || "");
  const [approvedDateFrom, setApprovedDateFrom] = useState(initialFilters.ApprovedDateFrom || "");
  const [approvedDateTo, setApprovedDateTo] = useState(initialFilters.ApprovedDateTo || "");
  const [completedDateFrom, setCompletedDateFrom] = useState(initialFilters.CompletedDateFrom || "");
  const [completedDateTo, setCompletedDateTo] = useState(initialFilters.CompletedDateTo || "");

  const handleApply = () => {
    const filters: FilterData = {
      Status: status,
      CreatedBy: createdBy,
      CreatedDateFrom: createdDateFrom,
      CreatedDateTo: createdDateTo,
      ReferenceNumber: referenceNumber,
      TotalCostMin: totalCostMin,
      TotalCostMax: totalCostMax,
      ApprovedDateFrom: approvedDateFrom,
      ApprovedDateTo: approvedDateTo,
      CompletedDateFrom: completedDateFrom,
      CompletedDateTo: completedDateTo,
    };

    // Loại bỏ các trường rỗng
    Object.keys(filters).forEach((key) => {
      if (!filters[key]) {
        delete filters[key];
      }
    });

    onSubmit(filters);
    onClose();
  };

  const handleClear = () => {
    setStatus("");
    setCreatedBy("");
    setCreatedDateFrom("");
    setCreatedDateTo("");
    setReferenceNumber("");
    setTotalCostMin("");
    setTotalCostMax("");
    setApprovedDateFrom("");
    setApprovedDateTo("");
    setCompletedDateFrom("");
    setCompletedDateTo("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Filter Inventory Imports</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="Status"
              fullWidth
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <MenuItem value="">None</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Created By"
              fullWidth
              type="number"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Created Date From"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={createdDateFrom}
              onChange={(e) => setCreatedDateFrom(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Created Date To"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={createdDateTo}
              onChange={(e) => setCreatedDateTo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Reference Number"
              fullWidth
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Total Cost Min"
              fullWidth
              type="number"
              value={totalCostMin}
              onChange={(e) => setTotalCostMin(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Total Cost Max"
              fullWidth
              type="number"
              value={totalCostMax}
              onChange={(e) => setTotalCostMax(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Approved Date From"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={approvedDateFrom}
              onChange={(e) => setApprovedDateFrom(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Approved Date To"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={approvedDateTo}
              onChange={(e) => setApprovedDateTo(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Completed Date From"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={completedDateFrom}
              onChange={(e) => setCompletedDateFrom(e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Completed Date To"
              fullWidth
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={completedDateTo}
              onChange={(e) => setCompletedDateTo(e.target.value)}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClear}>Clear</Button>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleApply} variant="contained">
          Apply
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
