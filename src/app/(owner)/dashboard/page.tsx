"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Grid,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Paper,
  Skeleton,
  Grow,
} from "@mui/material";
import {
  Inventory,
  MonetizationOn,
  LocalShipping,
  TrendingUp,
} from "@mui/icons-material";
import InfoCard from "@/components/Dashboard/InfoCard";
import StatusPieChart, { StatusCount } from "@/components/Dashboard/StatusPieChart";
import { DashboardData } from "@/type/dashboard";
import { getDashboard } from "@/ultis/dashboardapi";
import RevenuePage from "./revenue/page";

const DashboardOverviewPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("");
  const router = useRouter();

  const statusOptions = useMemo(() => {
    if (!data) return [];
    const imp = data.importStatusCounts.map((s) => s.status);
    const disp = data.dispatchStatusCounts.map((s) => s.status);
    const transf = data.transferStatusCounts.map((s) => s.status);
    return Array.from(new Set([...imp, ...disp, ...transf]));
  }, [data]);

  useEffect(() => {
    setLoading(true);
    getDashboard(statusFilter)
      .then((res) => setData(res.data))
      .catch((error) => console.error("Error fetching dashboard:", error))
      .finally(() => setLoading(false));
  }, [statusFilter]);

  return (
    <Box
      sx={{
        p: 4,
        bgcolor: "#f4f4f4", // nền xám nhạt thay vì trắng tinh
        minHeight: "100vh",
        color: "#111",
      }}
    >
      <Typography
        variant="h4"
        fontWeight={700}
        textAlign="center"
        mb={4}
        sx={{ color: "#111" }}
      >
        Thống Kê Nhập - Xuất - Chuyển Kho
      </Typography>

      <Grow in>
        <Paper
          elevation={0}
          sx={{
            p: 2,
            mb: 5,
            border: "1px solid #ccc",
            borderRadius: 3,
            backgroundColor: "#fff",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <FormControl sx={{ minWidth: 280 }} disabled={loading}>
            <InputLabel id="status-filter-label">Lọc theo trạng thái</InputLabel>
            <Select
              labelId="status-filter-label"
              value={statusFilter}
              label="Lọc theo trạng thái"
              onChange={(e) => setStatusFilter(e.target.value)}
              renderValue={(selected) =>
                selected ? <Chip label={selected} /> : <em>Tất cả</em>
              }
              sx={{
                bgcolor: "#fff",
              }}
            >
              <MenuItem value="">
                <em>Tất cả</em>
              </MenuItem>
              {statusOptions.map((status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
        </Paper>
      </Grow>

      <Grid container spacing={3} mb={6}>
        {[
          {
            title: "Tổng lượt nhập kho",
            value: data?.totalImports,
            icon: <Inventory sx={{ color: "#333" }} />,
            path: "/dashboard/detail/imports",
          },
          {
            title: "Tổng chi phí nhập",
            value: data?.totalImportCost?.toLocaleString("vi-VN", {
              style: "currency",
              currency: "VND",
            }),
            icon: <MonetizationOn sx={{ color: "#333" }} />,
            path: "/dashboard/detail/imports",
          },
          {
            title: "Tổng lượt xuất kho",
            value: data?.totalDispatches,
            icon: <LocalShipping sx={{ color: "#333" }} />,
            path: "/dashboard/detail/dispatches",
          },
          {
            title: "Tổng lượt chuyển kho",
            value: data?.totalTransfers,
            icon: <TrendingUp sx={{ color: "#333" }} />,
            path: "/dashboard/detail/transfers",
          },
        ].map((item, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            {loading || item.value === undefined ? (
              <Skeleton variant="rectangular" height={140} />
            ) : (
              <InfoCard
                title={item.title}
                value={item.value}
                icon={item.icon}
                onClick={() => router.push(item.path)}
                sx={{
                  backgroundColor: "#fff",
                  border: "1px solid #ddd",
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-4px)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  },
                }}
              />
            )}
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={4}>
        {[
          { title: "Tình trạng Nhập kho", data: data?.importStatusCounts },
          { title: "Tình trạng Xuất kho", data: data?.dispatchStatusCounts },
          { title: "Tình trạng Chuyển kho", data: data?.transferStatusCounts },
        ].map((chart, index) => (
          <Grid item xs={12} md={4} key={index}>
            {loading || !chart.data ? (
              <Skeleton variant="rectangular" height={240} />
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  border: "1px solid #ddd",
                  borderRadius: 3,
                  backgroundColor: "#fff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                }}
              >
                <StatusPieChart
                  title={chart.title}
                  data={chart.data as StatusCount[]}
                />
              </Paper>
            )}
          </Grid>
        ))}
      </Grid>
      <Paper
        elevation={0}
        sx={{
          p: 4,
          backgroundColor: '#fff',
          borderRadius: 3,
          border: '1px solid #ddd',
          boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
          mt : '40px'
        }}
      >
        <RevenuePage />
      </Paper>
    </Box>
  );
};

export default DashboardOverviewPage;
