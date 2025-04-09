"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  IconButton,
  Pagination,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import toast, { Toaster } from "react-hot-toast";
import WarehouseStockTable from "@/components/WarehouseStock/WarehouseStockTable";
import { WarehouseStock, WarehouseStockResponse } from "@/type/WarehouseResponse";
import { getWarehouseStocks } from "@/ultis/warehouseapi";

export default function WarehouseStockPage() {
  // Data state
  const [stocks, setStocks] = useState<WarehouseStock[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Pagination (API dùng 1-index)
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Sorting
  const [sortField, setSortField] = useState<string>("stockId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Dialog filter (nếu cần về sau)
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);

  // Memoize fetchData để dùng trong useEffect và handlers
  const fetchData = useCallback(async () => {
    try {
      const params = {
        PageNumber: page,
        PageSize: pageSize,
        SortField: sortField,
        IsDescending: sortDirection === "desc",
      };
      const result: WarehouseStockResponse = await getWarehouseStocks(
        params.PageNumber,
        params.PageSize
      );
      if (result.status) {
        setStocks(result.data.data);
        setTotalCount(result.data.totalRecords);
      } else {
        toast.error(result.message || "Failed to fetch warehouse stocks.");
      }
    } catch (error) {
      console.error("Error fetching warehouse stocks:", error);
      toast.error("An error occurred while fetching data.");
    }
  }, [page, pageSize, sortField, sortDirection]);

  // Chỉ phụ thuộc vào fetchData đã memoized
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Xử lý sort change
  const handleSortChange = (field: string) => {
    const newDir = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDir);
    setPage(1);
  };

  // Xử lý page change (WarehouseStockTable dùng 0-index)
  const handleTablePageChange = (newZeroBasedPage: number) => {
    setPage(newZeroBasedPage + 1);
  };

  // Xử lý pageSize change
  const handleTablePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setPage(1);
  };

  // Tổng số trang
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Warehouse Stocks
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        / Warehouse / Stocks
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <IconButton onClick={() => setFilterDialogOpen(true)}>
          <FilterListIcon />
        </IconButton>
      </Box>

      <WarehouseStockTable
  stocks={stocks}
  totalRecords={totalCount}
  page={page - 1}
  pageSize={pageSize}
  onPageChange={handleTablePageChange}
  onPageSizeChange={handleTablePageSizeChange}
/>


      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          py: 2,
          boxShadow: 3,
          zIndex: 1300,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, v) => setPage(v)}
            color="primary"
          />
        </Box>
      </Box>

      <Toaster />
    </Box>
  );
}
