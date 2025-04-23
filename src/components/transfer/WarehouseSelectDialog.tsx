"use client";
import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import WarehouseDialogSelect from "../_inventory/_import/_create/WareHouseDialogSelect";
import { Warehouse } from "@/type/warehouse";

interface WarehouseSelectDialogProps {
  label: string;
  onSelect: (warehouse: Warehouse) => void;
  selectedWarehouse?: Warehouse;
}

const WarehouseSelectDialog: React.FC<WarehouseSelectDialogProps> = ({
  label,
  onSelect,
  selectedWarehouse,
}) => {
  const [open, setOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSelect = (warehouse: Warehouse) => {
    onSelect(warehouse);
    handleClose();
  };

  return (
    <Box>
      <Typography variant="subtitle2" gutterBottom>
        {label}
      </Typography>
      <Button variant="outlined" onClick={handleOpen} fullWidth>
        {selectedWarehouse
          ? selectedWarehouse.warehouseName
          : `Chọn ${label}`}
      </Button>
      <WarehouseDialogSelect open={open} onClose={handleClose} onSelect={handleSelect} />
    </Box>
  );
};

export default WarehouseSelectDialog;
