"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Pagination,
  Button,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import toast, { Toaster } from "react-hot-toast";
import WarehouseStockTable from "@/components/WarehouseStock/WarehouseStockTable";
// import FilterDialog, { FilterData } from "@/components/WarehouseStock/FilterForm";
import { WarehouseStock, WarehouseStockResponse } from "@/type/WarehouseResponse";
import { getWarehouseStocks } from "@/ultis/warehouseapi";

export default function WarehouseStockPage() {
  // Data state
  const [stocks, setStocks] = useState<WarehouseStock[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Bộ lọc
//   const [currentFilter, setCurrentFilter] = useState<FilterData>({});

  // Phân trang: API giả sử sử dụng 1-index nên page sẽ tính từ 1
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Sắp xếp
  const [sortField, setSortField] = useState<string>("stockId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Dialog filter và tạo mới
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);

  // Hàm gọi API với các tham số mới
  const fetchData = async () => {
    try {
      const requestParams = {
        // ...currentFilter,
        PageNumber: page,
        PageSize: pageSize,
        SortField: sortField,
        IsDescending: sortDirection === "desc",
      };
      // Giả sử API của WarehouseStock sử dụng 2 tham số page và pageSize
      const result: WarehouseStockResponse = await getWarehouseStocks(requestParams.PageNumber, requestParams.PageSize);
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
  };

  useEffect(() => {
    fetchData();
  }, [ page, pageSize, sortField, sortDirection]);

  // Hàm xử lý thay đổi sắp xếp (ví dụ: khi người dùng bấm vào header của bảng)
  const handleSortChange = (field: string) => {
    let newDirection: "asc" | "desc" = "asc";
    if (sortField === field && sortDirection === "asc") {
      newDirection = "desc";
    }
    setSortField(field);
    setSortDirection(newDirection);
    setPage(1);
  };

  // Hàm xử lý gửi bộ lọc từ dialog (reset trang về 1)
//   const handleFilterSubmit = (filters: FilterData) => {
//     setCurrentFilter(filters);
//     setPage(1);
//   };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Tính số trang dựa trên tổng số bản ghi và số dòng mỗi trang
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Warehouse Stocks
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        / Warehouse / Stocks
      </Typography>

      {/* Nút hiển thị filter và tạo mới */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <IconButton onClick={() => setFilterDialogOpen(true)}>
          <FilterListIcon />
        </IconButton>
      
      </Box>

      {/* Bảng hiển thị danh sách Warehouse Stocks */}
      <WarehouseStockTable
  stocks={stocks}
  totalRecords={totalCount}
  page={page - 1} // Nếu WarehouseStockTable sử dụng 0-index và state page của bạn đang là 1-index, cần chuyển đổi
  pageSize={pageSize}
  onPageChange={(newPage) => {
    setPage(newPage + 1);
    fetchData();
  }}
  onPageSizeChange={(newSize) => {
    setPageSize(newSize);
    setPage(1);
    fetchData();
  }}
/>


      {/* Phân trang */}
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
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      </Box>

      <Toaster />
    </Box>
  );
}
