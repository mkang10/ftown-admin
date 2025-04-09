"use client";
import React, { useState, useEffect, useCallback } from "react";
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
import {
  TransferFilterData,
  TransferOrderItem,
  TransferResponse,
} from "@/type/transfer";
import TransferTable from "@/components/transfer/TransferTable";
import FilterDialog from "@/components/transfer/FilterDialog";
import CreateTransferModal from "@/components/transfer/CreateTransferModal";

export default function TransferPage() {
  // Data state
  const [data, setData] = useState<TransferOrderItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Filter state
  const [currentFilter, setCurrentFilter] = useState<TransferFilterData>({});

  // Pagination
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Dialogs
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  // Memoize fetchData để dùng trong useEffect và onSuccess
  const fetchData = useCallback(async () => {
    try {
      const requestParams = {
        page,
        pageSize,
        filter: currentFilter.filter || "",
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
  }, [page, pageSize, currentFilter]);

  // Chỉ phụ thuộc vào fetchData đã memoized
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Xử lý filter submit
  const handleFilterSubmit = (filters: TransferFilterData) => {
    setCurrentFilter(filters);
    setPage(1);
  };

  // Xử lý page change
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Transfers
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        / Transfers / List
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <IconButton onClick={() => setFilterDialogOpen(true)}>
          <FilterListIcon />
        </IconButton>
        <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
          Create Transfer
        </Button>
      </Box>

      <TransferTable data={data} />

      <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>

      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onSubmit={handleFilterSubmit}
        initialFilters={currentFilter}
      />

      <CreateTransferModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchData}
      />

      <Toaster />
    </Box>
  );
}
