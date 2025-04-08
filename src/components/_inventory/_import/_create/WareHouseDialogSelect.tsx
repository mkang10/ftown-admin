"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Pagination,
  CircularProgress,
  Typography,
} from "@mui/material";
import { getWarehouses } from "@/ultis/importapi"; // Giả sử có hàm này trả về danh sách warehouse
import { Warehouse } from "@/type/warehouse";



interface WarehouseDialogSelectProps {
  open: boolean;
  onClose: () => void;
  onSelect: (warehouse: Warehouse) => void;
}

const WarehouseDialogSelect: React.FC<WarehouseDialogSelectProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const pageSize = 5;

  useEffect(() => {
    if (open) {
      const fetchWarehouses = async () => {
        setLoading(true);
        try {
          const result = await getWarehouses(page, pageSize);
          setWarehouses(result.data);
          setTotalRecords(result.totalRecords);
        } catch (error) {
          setError("Error loading warehouses");
        } finally {
          setLoading(false);
        }
      };
      fetchWarehouses();
    }
  }, [open, page]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const handleSelect = (warehouse: Warehouse) => {
    onSelect(warehouse);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{ sx: { p: 2, height: 400 } }}
    >
      <DialogTitle>Select Warehouse</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={24} />
          </Box>
        ) : error ? (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        ) : warehouses.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            No warehouses available.
          </Typography>
        ) : (
          <>
            <List>
              {warehouses.map((warehouse) => (
                <ListItem key={warehouse.warehouseId} disableGutters>
                  <ListItemButton onClick={() => handleSelect(warehouse)}>
                    <ListItemAvatar>
                      <Avatar
                        src={warehouse.mainImagePath}
                        alt={warehouse.warehouseName}
                        sx={{ width: 40, height: 40, mr: 1 }}
                      />
                    </ListItemAvatar>
                    <ListItemText primary={warehouse.warehouseName} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Pagination
                count={Math.ceil(totalRecords / pageSize)}
                page={page}
                onChange={handlePageChange}
                size="small"
                color="primary"
              />
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WarehouseDialogSelect;
