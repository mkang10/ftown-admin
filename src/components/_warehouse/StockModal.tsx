'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  TextField,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Pagination,
  Skeleton
} from '@mui/material';
import { PaginatedResponse, WarehouseStock } from '@/type/WarehouseList';
import { fetchWarehouseStock } from '@/ultis/warehouseapi';

interface StockModalProps {
  open: boolean;
  onClose: () => void;
  warehouseName: string;
  warehouseId: number;
  onRowClick: (stockId: number) => void;
}

const StockModal: React.FC<StockModalProps> = ({
  open,
  onClose,
  warehouseName,
  warehouseId,
  onRowClick
}) => {
  const [stocks, setStocks] = useState<WarehouseStock[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    productName: '',
    sizeName: '',
    colorName: '',
    stockQuantity: ''
  });
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [totalRecords, setTotalRecords] = useState(0);

  // Lấy dữ liệu khi modal mở, trang hoặc bộ lọc thay đổi
  useEffect(() => {
    if (!open) return;
    setLoading(true);
    fetchWarehouseStock(warehouseId, {
      productName: filters.productName || undefined,
      sizeName: filters.sizeName || undefined,
      colorName: filters.colorName || undefined,
      stockQuantity: filters.stockQuantity ? Number(filters.stockQuantity) : undefined,
      page,
      pageSize
    })
      .then((r: PaginatedResponse<WarehouseStock>) => {
        setStocks(r.data);
        setTotalRecords(r.totalRecords);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open, page, filters]);

  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="lg">
      {/* Tiêu đề modal hiển thị tên kho */}
      <DialogTitle>Kho: {warehouseName}</DialogTitle>

      <DialogContent sx={{ maxHeight: 600, overflowY: 'auto' }}>
        {/* Bộ lọc tìm kiếm */}
        <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
          <TextField
            label="Tên sản phẩm"
            size="small"
            value={filters.productName}
            onChange={e => setFilters(f => ({ ...f, productName: e.target.value }))}
          />
          <TextField
            label="Kích cỡ"
            size="small"
            value={filters.sizeName}
            onChange={e => setFilters(f => ({ ...f, sizeName: e.target.value }))}
          />
          <TextField
            label="Màu sắc"
            size="small"
            value={filters.colorName}
            onChange={e => setFilters(f => ({ ...f, colorName: e.target.value }))}
          />
          <TextField
            label="Số lượng tối thiểu"
            size="small"
            type="number"
            value={filters.stockQuantity}
            onChange={e => setFilters(f => ({ ...f, stockQuantity: e.target.value }))}
          />
          <Button variant="contained" size="small" onClick={() => setPage(1)}>
            Tìm kiếm
          </Button>
        </Box>

        {/* Bảng danh sách tồn kho */}
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tên sản phẩm</TableCell>
              <TableCell>Kích cỡ</TableCell>
              <TableCell>Màu sắc</TableCell>
              <TableCell align="right">Số lượng</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? Array.from({ length: pageSize }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell><Skeleton /></TableCell>
                    <TableCell align="right"><Skeleton /></TableCell>
                  </TableRow>
                ))
              : stocks.map(stock => (
                  <TableRow key={stock.wareHouseStockId} hover>
                    <TableCell
                      sx={{ cursor: 'pointer' }}
                      onClick={() => onRowClick(stock.wareHouseStockId)}
                    >
                      {stock.productName}
                    </TableCell>
                    <TableCell
                      sx={{ cursor: 'pointer' }}
                      onClick={() => onRowClick(stock.wareHouseStockId)}
                    >
                      {stock.sizeName}
                    </TableCell>
                    <TableCell
                      sx={{ cursor: 'pointer' }}
                      onClick={() => onRowClick(stock.wareHouseStockId)}
                    >
                      {stock.colorName}
                    </TableCell>
                    <TableCell
                      align="right"
                      sx={{ cursor: 'pointer' }}
                      onClick={() => onRowClick(stock.wareHouseStockId)}
                    >
                      {stock.stockQuantity}
                    </TableCell>
                  </TableRow>
                ))
            }
          </TableBody>
        </Table>

        {/* Phân trang nếu có nhiều trang */}
        {totalPages > 1 && (
          <Box display="flex" justifyContent="center" my={2}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, v) => setPage(v)}
              color="primary"
            />
          </Box>
        )}
      </DialogContent>

      {/* Nút đóng modal */}
      <DialogActions>
        <Button onClick={onClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
};

export default StockModal;
