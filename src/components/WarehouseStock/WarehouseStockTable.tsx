"use client";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  TablePagination,
  Typography,
} from "@mui/material";
import { WarehouseStock } from "@/type/WarehouseResponse";

interface WarehouseStockTableProps {
  stocks: WarehouseStock[];
  totalRecords: number;
  page: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
  onPageSizeChange: (newPageSize: number) => void;
}

const WarehouseStockTable: React.FC<WarehouseStockTableProps> = ({
  stocks,
  totalRecords,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}) => {
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    onPageChange(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    onPageSizeChange(parseInt(event.target.value, 10));
    onPageChange(0); // Reset trang về 0 khi thay đổi pageSize
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper sx={{ borderRadius: "12px", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "white" }}>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Warehouse Name
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Product Name
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Stock Quantity
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stocks.map((stock) => (
                <TableRow key={stock.wareHouseStockId} hover>
                  <TableCell align="center">{stock.warehouseName}</TableCell>
                  <TableCell align="center">{stock.fullProductName}</TableCell>
                  <TableCell align="center">{stock.stockQuantity}</TableCell>
                </TableRow>
              ))}
              {stocks.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No warehouse stocks available.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalRecords}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={pageSize}
          onRowsPerPageChange={handleChangeRowsPerPage}
          rowsPerPageOptions={[5, 10, 20]}
        />
      </Paper>
    </Box>
  );
};

export default WarehouseStockTable;
