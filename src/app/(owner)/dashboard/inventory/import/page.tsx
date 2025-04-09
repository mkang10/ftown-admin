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
import InventoryTable from "@/components/_inventory/_import/InventoryTable";
import ApproveRejectDialog from "@/components/_inventory/_import/ApproveRejectDialog";
import CreateInventoryImportModal from "@/components/_inventory/_import/_create/CreateInventoryImportModal";
import {
  InventoryImportItem,
  ApproveRejectPayload,
  FilterInventoryResponse,
} from "@/type/InventoryImport";
import {
  approveInventoryImport,
  filterInventoryImports,
  rejectInventoryImport,
} from "@/ultis/importapi";
import FilterDialog, { FilterData } from "@/components/_inventory/_import/FIlterForm";

export default function InventoryApprovalPage() {
  const [data, setData] = useState<InventoryImportItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);

  // Filter state
  const [currentFilter, setCurrentFilter] = useState<FilterData>({});

  // Phân trang
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Sắp xếp
  const [sortField, setSortField] = useState<string>("importId");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Dialog filter
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);

  // Dialog approve/reject
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"Approved" | "Rejected" | null>(null);
  const [selectedImportId, setSelectedImportId] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");

  // Dialog create import
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);

  // Memoize fetchData để dùng cả trong useEffect và onSuccess của CreateInventoryImportModal
  const fetchData = useCallback(async () => {
    try {
      const requestParams = {
        ...currentFilter,
        PageNumber: page,
        PageSize: pageSize,
        SortField: sortField,
        IsDescending: sortDirection === "desc",
      };
      const result: FilterInventoryResponse = await filterInventoryImports(requestParams);
      if (result.status) {
        const mappedData = result.data.data.map((item) => ({
          ...item,
          createdDate: new Date(item.createdDate).toLocaleString(),
        }));
        setData(mappedData);
        setTotalCount(result.data.totalCount);
      } else {
        toast.error(result.message || "Failed to fetch data.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("An error occurred while fetching data.");
    }
  }, [currentFilter, page, pageSize, sortField, sortDirection]);

  // Chỉ phụ thuộc vào fetchData đã memoized
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sắp xếp
  const handleSortChange = (field: string) => {
    const newDirection = sortField === field && sortDirection === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortDirection(newDirection);
    setPage(1);
  };

  // Filter
  const handleFilterSubmit = (filters: FilterData) => {
    setCurrentFilter(filters);
    setPage(1);
  };

  // Phân trang
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Mở modal approve/reject
  const handleAction = (
    action: "Approved" | "Rejected",
    importId: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation();
    setActionType(action);
    setSelectedImportId(importId);
    setComment("");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  // Xử lý submit approve/reject
  const handleActionSubmit = async () => {
    if (selectedImportId == null || !actionType) return;

    let changedBy = 0;
    try {
      const account = JSON.parse(localStorage.getItem("account") || "{}");
      changedBy = account.accountId ?? 0;
    } catch {
      console.warn("Could not parse account from localStorage");
    }

    const payload: ApproveRejectPayload = {
      changedBy,
      comments: comment || "đã cập nhật",
    };

    try {
      const result =
        actionType === "Approved"
          ? await approveInventoryImport(selectedImportId, payload)
          : await rejectInventoryImport(selectedImportId, payload);

      if (result.status) {
        setData((prev) =>
          prev.map((item) =>
            item.importId === selectedImportId
              ? { ...item, status: actionType }
              : item
          )
        );
        toast.success(result.message || "Action successful");
      } else {
        toast.error(result.message || "Action failed");
      }
    } catch (error) {
      console.error("Action error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setModalOpen(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Inventory Approval
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        / Inventory / Approval
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <IconButton onClick={() => setFilterDialogOpen(true)}>
          <FilterListIcon />
        </IconButton>
        <Button variant="contained" onClick={() => setCreateModalOpen(true)}>
          Create Import
        </Button>
      </Box>

      <InventoryTable
        data={data}
        onAction={handleAction}
        sortField={sortField}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
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
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      </Box>

      <FilterDialog
        open={filterDialogOpen}
        onClose={() => setFilterDialogOpen(false)}
        onSubmit={handleFilterSubmit}
        initialFilters={currentFilter}
      />

      <ApproveRejectDialog
        open={modalOpen}
        actionType={actionType}
        comment={comment}
        onClose={closeModal}
        onSubmit={handleActionSubmit}
        onCommentChange={setComment}
      />

      <CreateInventoryImportModal
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSuccess={fetchData}
      />

      <Toaster />
    </Box>
  );
}
