"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  TextField,
  MenuItem,
  InputAdornment,
  Select,
  FormControl,
  InputLabel,
  Typography,
} from "@mui/material";

export interface FilterData {
  [key: string]: any;
}

interface FilterDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (filters: FilterData) => void;
  initialFilters?: FilterData;
}

const FilterDialog: React.FC<FilterDialogProps> = ({
  open,
  onClose,
  onSubmit,
  initialFilters = {},
}) => {
  const [status, setStatus] = useState(initialFilters.Status || "");
  const [createdBy, setCreatedBy] = useState(initialFilters.CreatedBy || "");
  const [createdDateFrom, setCreatedDateFrom] = useState(initialFilters.CreatedDateFrom || "");
  const [createdDateTo, setCreatedDateTo] = useState(initialFilters.CreatedDateTo || "");
  const [referenceNumber, setReferenceNumber] = useState(initialFilters.ReferenceNumber || "");
  const [totalCostMin, setTotalCostMin] = useState(initialFilters.TotalCostMin || "");
  const [totalCostMax, setTotalCostMax] = useState(initialFilters.TotalCostMax || "");
  const [approvedDateFrom, setApprovedDateFrom] = useState(initialFilters.ApprovedDateFrom || "");
  const [approvedDateTo, setApprovedDateTo] = useState(initialFilters.ApprovedDateTo || "");
  const [completedDateFrom, setCompletedDateFrom] = useState(initialFilters.CompletedDateFrom || "");
  const [completedDateTo, setCompletedDateTo] = useState(initialFilters.CompletedDateTo || "");
  const [dateRange, setDateRange] = useState(""); // Tạo state cho khoảng ngày

  // Hàm áp dụng khoảng ngày
  const handleDateRangeChange = (range: string) => {
    setDateRange(range);
    const currentDate = new Date();
    let startDate: string, endDate: string;
    
    switch (range) {
      case "1_week":
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 7)).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case "1_month":
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1)).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      case "1_year":
        startDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)).toISOString().split('T')[0];
        endDate = new Date().toISOString().split('T')[0];
        break;
      default:
        return;
    }
    
    setCreatedDateFrom(startDate);
    setCreatedDateTo(endDate);
  };

  const handleApply = () => {
    // Tự động nhân 1000 vào TotalCostMin và TotalCostMax trước khi gửi đi
    const filters: FilterData = {
      Status: status,
      CreatedBy: createdBy,
      CreatedDateFrom: createdDateFrom,
      CreatedDateTo: createdDateTo,
      ReferenceNumber: referenceNumber,
      TotalCostMin: totalCostMin ? totalCostMin * 1000 : "",
      TotalCostMax: totalCostMax ? totalCostMax * 1000 : "",
      ApprovedDateFrom: approvedDateFrom,
      ApprovedDateTo: approvedDateTo,
      CompletedDateFrom: completedDateFrom,
      CompletedDateTo: completedDateTo,
    };

    // Loại bỏ các trường rỗng
    Object.keys(filters).forEach((key) => {
      if (!filters[key]) {
        delete filters[key];
      }
    });

    onSubmit(filters);
    onClose();
  };

  const handleClear = () => {
    setStatus("");
    setCreatedBy("");
    setCreatedDateFrom("");
    setCreatedDateTo("");
    setReferenceNumber("");
    setTotalCostMin("");
    setTotalCostMax("");
    setApprovedDateFrom("");
    setApprovedDateTo("");
    setCompletedDateFrom("");
    setCompletedDateTo("");
    setDateRange("");
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      {/* Header */}
      <DialogTitle sx={{ backgroundColor: "#000", color: "#fff", fontWeight: 600, fontSize: "1.2rem" }}>
        Lọc Nhập Kho
      </DialogTitle>

      {/* Nội dung Dialog */}
      <DialogContent sx={{ backgroundColor: "#fff" }}>
        <Typography variant="h6" sx={{ color: "black", mb: 2 }}>
          Chọn các tiêu chí lọc cho nhập kho
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              label="Trạng thái"
              fullWidth
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={{
                backgroundColor: "#f5f5f5",
                color: "black",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  borderColor: "#ccc",
                },
              }}
            >
              <MenuItem value="">Không</MenuItem>
              <MenuItem value="pending">Chờ xử lý</MenuItem>
              <MenuItem value="approved">Đã duyệt</MenuItem>
              <MenuItem value="rejected">Từ chối</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Người tạo"
              fullWidth
              type="number"
              value={createdBy}
              onChange={(e) => setCreatedBy(e.target.value)}
              sx={{
                backgroundColor: "#f5f5f5",
                color: "black",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  borderColor: "#ccc",
                },
              }}
            />
          </Grid>

          {/* Khoảng ngày */}
          <Grid item xs={12} sm={6} md={4}>
            <FormControl fullWidth>
              <InputLabel sx={{ color: "black" }}>Khoảng ngày</InputLabel>
              <Select
                value={dateRange}
                onChange={(e) => handleDateRangeChange(e.target.value)}
                sx={{
                  backgroundColor: "#f5f5f5",
                  color: "black",
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-root": {
                    borderColor: "#ccc",
                  },
                }}
              >
                <MenuItem value="1_week">1 tuần</MenuItem>
                <MenuItem value="1_month">1 tháng</MenuItem>
                <MenuItem value="1_year">1 năm</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Mã tham chiếu"
              fullWidth
              value={referenceNumber}
              onChange={(e) => setReferenceNumber(e.target.value)}
              sx={{
                backgroundColor: "#f5f5f5",
                color: "black",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  borderColor: "#ccc",
                },
              }}
            />
          </Grid>

          {/* Khoảng giá */}
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Giá trị tối thiểu"
              fullWidth
              type="number"
              value={totalCostMin}
              onChange={(e) => setTotalCostMin(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">VND(đơn vị nghìn)</InputAdornment>,
              }}
              sx={{
                backgroundColor: "#f5f5f5",
                color: "black",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  borderColor: "#ccc",
                },
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <TextField
              label="Giá trị tối đa"
              fullWidth
              type="number"
              value={totalCostMax}
              onChange={(e) => setTotalCostMax(e.target.value)}
              InputProps={{
                startAdornment: <InputAdornment position="start">VND</InputAdornment>,
              }}
              sx={{
                backgroundColor: "#f5f5f5",
                color: "black",
                borderRadius: "8px",
                "& .MuiOutlinedInput-root": {
                  borderColor: "#ccc",
                },
              }}
            />
          </Grid>
        </Grid>
      </DialogContent>

      {/* Footer Actions */}
      <DialogActions sx={{ backgroundColor: "#f5f5f5" }}>
        <Button onClick={handleClear} sx={{ color: "black", fontWeight: 500 }}>
          Xóa
        </Button>
        <Button onClick={onClose} sx={{ color: "black", fontWeight: 500 }}>
          Hủy
        </Button>
        <Button onClick={handleApply} variant="contained" sx={{ backgroundColor: "#000", color: "white", fontWeight: 600 }}>
          Áp dụng
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FilterDialog;
