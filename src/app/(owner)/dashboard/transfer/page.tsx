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
import TransferTable from "@/components/transfer/TransferTable";
import FilterDialog, { FilterData } from "@/components/transfer/FilterDialog";
import CreateTransferModal from "@/components/transfer/CreateTransferModal";
import { filterTransfers } from "@/ultis/transferapi";
import { TransferItem } from "antd/es/transfer";
import { TransferResponse } from "@/type/transfer";

export default function TransferPage() {
  // Data state
  const [data, setData] = useState<TransferItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Filter state
  const [currentFilter, setCurrentFilter] = useState<FilterData>({});

  // Phân trang (API sử dụng page tính từ 1)
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Sắp xếp
  const [sortField, setSortField] = useState<string>("transferId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Dialog state
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  // Hàm gọi API với các tham số hiện tại
  const fetchData = async () => {
    try {
      const requestParams = {
        page,
        pageSize,
        filter: currentFilter.filter || "",
        // Nếu sau này bạn cần sort thì có thể thêm:
        // sortField,
        // isDescending: sortDirection === "desc",
      };
  
      const result = await filterTransfers(requestParams);
  
      if (result.status) {
        setData(result.data.data);
        setTotalCount(result.data.totalRecords);
      } else {
        toast.error(result.message || "Failed to fetch transfers");
      }
    } catch (error) {
      console.error("Error fetching transfers:", error);
      toast.error("An error occurred while fetching transfers");
    }
  };
  

  useEffect(() => {
    fetchData();
  }, [currentFilter, page, pageSize, sortField, sortDirection]);

  // Hàm xử lý thay đổi filter
  const handleFilterSubmit = (filters: FilterData) => {
    setCurrentFilter(filters);
    setPage(1);
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Hàm xử lý thay đổi sắp xếp
  const handleSortChange = (field: string) => {
    let newDirection: "asc" | "desc" = "asc";
    if (sortField === field && sortDirection === "asc") {
      newDirection = "desc";
    }
    setSortField(field);
    setSortDirection(newDirection);
    setPage(1);
  };

  // Tính tổng số trang
  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Transfers
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        / Transfers / List
      </Typography>

      {/* Nút hiển thị dialog filter và tạo mới transfer */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <IconButton onClick={() => setFilterDialogOpen(true)}>
          <FilterListIcon />
        </IconButton>
        <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
          Create Transfer
        </Button>
      </Box>

      {/* Bảng hiển thị danh sách transfer */}
      <TransferTable 
        data={data} 
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
      />

      {/* Phân trang */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination 
          count={totalPages} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
        />
      </Box>

      {/* Dialog filter */}
      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onSubmit={handleFilterSubmit}
        initialFilters={currentFilter}
      />

      {/* Modal tạo mới transfer */}
      <CreateTransferModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchData}
      />

      <Toaster />
    </Box>
  );
}
