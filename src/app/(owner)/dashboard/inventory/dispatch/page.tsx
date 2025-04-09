"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  IconButton,
  Pagination,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import toast, { Toaster } from "react-hot-toast";
import { Dispatch, DispatchResponse } from "@/type/dispatch"; // ✅ import đúng
import FilterDispatchDialog, { FilterData } from "@/components/dispatch/DispatchFilter";
import { getDispatches } from "@/ultis/dispatch";
import DispatchTable from "@/components/dispatch/DispatchTable";

export default function DispatchApprovalPage() {
  const [data, setData] = useState<Dispatch[]>([]); // ✅ Đúng kiểu
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
  const [currentFilter, setCurrentFilter] = useState<FilterData>({});

  const fetchData = async () => {
    try {
      const response: DispatchResponse = await getDispatches(page, pageSize, currentFilter);
      setData(response.data);
      setTotalRecords(response.totalRecords);
    } catch (error) {
      console.error("Failed to fetch dispatches:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, pageSize, currentFilter]);

  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleFilterSubmit = (filters: FilterData) => {
    setCurrentFilter(filters);
    setPage(1);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Dispatch Management
      </Typography>

      <Box display="flex" justifyContent="space-between" mb={2}>
        <IconButton onClick={() => setFilterDialogOpen(true)}>
          <FilterListIcon />
        </IconButton>
      </Box>

      <DispatchTable
  data={data}
  onSortChange={(field: string) => {
    // bạn có thể xử lý logic sort ở đây nếu muốn
    console.log("Sort by", field);
  }}
  sortField={"dispatchId"}         // hoặc field mặc định bạn dùng
  sortDirection={"asc"}            // hoặc "desc", tuỳ logic bạn dùng
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
        <Box display="flex" justifyContent="center">
          <Pagination
            count={Math.ceil(totalRecords / pageSize)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>

      <FilterDispatchDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onSubmit={handleFilterSubmit}
        initialFilters={currentFilter}
      />

      <Toaster />
    </Box>
  );
}
