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
  Fade,
} from "@mui/material";
import { getWarehouses } from "@/ultis/importapi";
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
      (async () => {
        setLoading(true);
        try {
          const result = await getWarehouses(page, pageSize);
          setWarehouses(result.data);
          setTotalRecords(result.totalRecords);
          setError("");
        } catch {
          setError("Không thể tải danh sách kho.");
        } finally {
          setLoading(false);
        }
      })();
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
      TransitionComponent={Fade}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          p: 3,
          height: 420,
          bgcolor: "#fafafa",
          borderRadius: 4,
          boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        },
      }}
    >
      <DialogTitle sx={{ px: 0, pb: 1, mb: 2 }}>
        <Typography
          variant="h6"
          fontWeight="bold"
          sx={{
            color: "#333",
            textTransform: "uppercase",
            borderBottom: "1px solid #e0e0e0",
            pb: 1,
            fontSize: "1rem",
          }}
        >
          Chọn kho lưu trữ
        </Typography>
      </DialogTitle>

      <DialogContent
        dividers
        sx={{
          p: 0,
          overflow: "hidden", // <-- Ẩn scrollbar tổng
        }}
      >
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress size={26} />
          </Box>
        ) : error ? (
          <Typography
            variant="body2"
            sx={{
              color: "#d32f2f",
              fontWeight: 500,
              textAlign: "center",
              py: 2,
            }}
          >
            {error}
          </Typography>
        ) : warehouses.length === 0 ? (
          <Typography
            variant="body2"
            sx={{
              color: "#888",
              textAlign: "center",
              py: 2,
            }}
          >
            Không có kho nào để hiển thị.
          </Typography>
        ) : (
          <>
            <List
              sx={{
                maxHeight: 270,
                overflowY: "auto", // Chỉ cho phép dọc
                overflowX: "hidden", // Ẩn ngang
                px: 0,
              }}
            >
              {warehouses.map((wh) => (
                <ListItem key={wh.warehouseId} disableGutters>
                  <ListItemButton
                    onClick={() => handleSelect(wh)}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 3,
                      mb: 1.5,
                      px: 2,
                      py: 1.4,
                      transition: "all 0.2s",
                      backgroundColor: "#fff",
                      "&:hover": {
                        backgroundColor: "#000",
                        transform: "scale(1.01)",
                        "& .MuiListItemText-primary": {
                          color: "#fff",
                        },
                      },
                    }}
                  >
                    <ListItemAvatar>
                      <Avatar
                        src={wh.mainImagePath}
                        alt={wh.warehouseName}
                        sx={{
                          width: 42,
                          height: 42,
                          mr: 2,
                          border: "1px solid #ccc",
                        }}
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={wh.warehouseName}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        color: "#333",
                        fontSize: "0.95rem",
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>

            <Box sx={{ display: "flex", justifyContent: "center"}}>
              <Pagination
                
                count={Math.ceil(totalRecords / pageSize)}
                page={page}
                onChange={handlePageChange}
                size="small"
                sx={{
                  "& .MuiPaginationItem-root": {
                    color: "#555",
                    borderRadius: 2,
                    border: "1px solid #ccc",
                    "&:hover": {
                      backgroundColor: "#000",
                      color: "#fff",
                    },
                    "&.Mui-selected": {
                      backgroundColor: "#000",
                      color: "#fff",
                      borderColor: "#000",
                    },
                  },
                }}
              />
            </Box>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default WarehouseDialogSelect;
