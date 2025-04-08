"use client";
import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

interface WarehouseStockFilterFormProps {
  initialPage: number;
  initialPageSize: number;
  onFilterSubmit: (page: number, pageSize: number) => void;
}

const WarehouseStockFilterForm: React.FC<WarehouseStockFilterFormProps> = ({
  initialPage,
  initialPageSize,
  onFilterSubmit,
}) => {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterSubmit(page, pageSize);
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", gap: 2, mb: 2 }}
    >
      <TextField
        label="Page"
        type="number"
        value={page}
        onChange={(e) => setPage(parseInt(e.target.value, 10) || 1)}
        size="small"
      />
      <TextField
        label="Page Size"
        type="number"
        value={pageSize}
        onChange={(e) => setPageSize(parseInt(e.target.value, 10) || 10)}
        size="small"
      />
      <Button type="submit" variant="contained" color="primary">
        Apply
      </Button>
    </Box>
  );
};

export default WarehouseStockFilterForm;
