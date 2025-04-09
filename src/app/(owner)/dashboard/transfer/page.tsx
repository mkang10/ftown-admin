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
import { filterTransfers } from "@/ultis/transferapi";
import { TransferFilterData, TransferOrderItem, TransferResponse } from "@/type/transfer";
import TransferTable from "@/components/transfer/TransferTable";
import FilterDialog from "@/components/transfer/FilterDialog";
import CreateTransferModal from "@/components/transfer/CreateTransferModal";

export default function TransferPage() {
  // Data state
  const [data, setData] = useState<TransferOrderItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Filter state (ở đây ta giả sử chỉ có một trường filter đơn giản)
  const [currentFilter, setCurrentFilter] = useState<TransferFilterData>({});

  // Phân trang (API sử dụng page tính từ 1)
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Nếu muốn hỗ trợ sắp xếp thêm...
  // const [sortField, setSortField] = useState<string>("transferOrderId");
  // const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Dialog state
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  // Hàm call API: sử dụng filterTransfers với thông số bao gồm page, pageSize, filter, ...
  const fetchData = async () => {
    try {
      const requestParams = {
        page,
        pageSize,
        filter: currentFilter.filter || "",
        // Nếu có sort: sortField, isDescending: sortDirection === "desc",
      };

      const result: TransferResponse = await filterTransfers(requestParams);

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
  }, [currentFilter, page, pageSize /*, sortField, sortDirection */]);

  // Hàm xử lý thay đổi filter
  const handleFilterSubmit = (filters: TransferFilterData) => {
    setCurrentFilter(filters);
    setPage(1);
  };

  // Hàm xử lý thay đổi trang
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
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

      {/* Nút mở dialog filter và tạo mới transfer */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <IconButton onClick={() => setFilterDialogOpen(true)}>
          <FilterListIcon />
        </IconButton>
        <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
          Create Transfer
        </Button>
      </Box>

      {/* Bảng hiển thị transfers */}
      <TransferTable data={data} />

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
