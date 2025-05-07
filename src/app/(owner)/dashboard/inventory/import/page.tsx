"use client";

import React, { useState, useEffect, useCallback ,useRef } from "react";
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
  importInventoryFromExcel,
  rejectInventoryImport,
} from "@/ultis/importapi";
import FilterDialog, { FilterData } from "@/components/_inventory/_import/FIlterForm";

export default function InventoryApprovalPage() {
  const [data, setData] = useState<InventoryImportItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
 // state mới cho upload Excel
 const [loadingExcel, setLoadingExcel] = useState(false);
 const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter state
  const [currentFilter, setCurrentFilter] = useState<FilterData>({});

  // Phân trang
  const [page, setPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);

  // Sắp xếp
  const [sortField, setSortField] = useState<string>("importId");
  // Mặc định giảm dần
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  // Dialog filter
  const [filterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);

  // Dialog approve/reject
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [actionType, setActionType] = useState<"Approved" | "Rejected" | null>(null);
  const [selectedImportId, setSelectedImportId] = useState<number | null>(null);
  const [comment, setComment] = useState<string>("");

  // Dialog create import
  const [createModalOpen, setCreateModalOpen] = useState<boolean>(false);
// hàm gọi API import từ Excel
const handleExcelImport = async (file: File) => {
  setLoadingExcel(true);
  try {
    const result = await importInventoryFromExcel(file);
    toast.success(result.message || "Import thành công");
    fetchData();
  } catch (err: any) {
    console.error(err);
    toast.error(err.message || "Import thất bại");
  } finally {
    setLoadingExcel(false);
  }
};

// khi bấm nút, mở file picker
const onClickExcelButton = () => {
  fileInputRef.current?.click();
};

// khi chọn file xong
const onChangeExcelFile = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;
  handleExcelImport(file);
  // reset lại để có thể chọn lại file cùng tên sau này
  e.target.value = "";
};
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
          createdDate: new Date(item.createdDate).toLocaleString("vi-VN"),
        }));
        setData(mappedData);
        setTotalCount(result.data.totalCount);
      } else {
        toast.error(result.message || "Không thể lấy dữ liệu.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Có lỗi xảy ra khi tải dữ liệu.");
    }
  }, [currentFilter, page, pageSize, sortField, sortDirection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Sắp xếp
  const handleSortChange = (field: string) => {
    const isSame = sortField === field;
    const newDirection: "asc" | "desc" = isSame && sortDirection === "desc" ? "asc" : "desc";
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
      console.warn("Không thể phân tích account từ localStorage");
    }

    const payload: ApproveRejectPayload = {
      changedBy,
      comments: comment || "Đã cập nhật",
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
        toast.success(result.message || "Thao tác thành công");
      } else {
        toast.error(result.message || "Thao tác thất bại");
      }
    } catch (error) {
      console.error("Action error:", error);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setModalOpen(false);
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Phiếu Nhập Kho
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 3 }}>
        / Nhập kho / 
      </Typography>

      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <IconButton
          onClick={() => setFilterDialogOpen(true)}
          title="Lọc"
          sx={{ backgroundColor: 'white', color: 'black', '&:hover': { backgroundColor: 'black', color: 'white' } }}
        >
          <FilterListIcon />
        </IconButton>
        <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
        <Button
          variant="contained"
          onClick={onClickExcelButton}
          disabled={loadingExcel}
          sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' } }}
        >
          {loadingExcel ? "Đang phân tích để tiến hành nhập hàng..." : "Nhập hàng từ file Excel"}
        </Button>
      
      </Box>

      {/* input file ẩn */}
      <input
        type="file"
        accept=".xlsx, .xls"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={onChangeExcelFile}
      />
        <Button
          variant="contained"
          onClick={() => setCreateModalOpen(true)}
          sx={{ backgroundColor: 'black', color: 'white', '&:hover': { backgroundColor: '#333' } }}
        >
          Tạo phiếu nhập
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
            sx={{ '& .MuiPaginationItem-root': { color: 'black' } }}
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
