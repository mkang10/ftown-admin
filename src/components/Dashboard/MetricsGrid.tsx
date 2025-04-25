// src/components/Dashboard/MetricsGrid.tsx
import React from 'react';
import { useRouter } from 'next/navigation';
import { Grid, Skeleton } from '@mui/material';
import InfoCard from '@/components/Dashboard/InfoCard';
import { DashboardData } from '@/type/dashboard';
import { RevenueSummary } from '@/type/revenue';
import {
  Inventory,
  MonetizationOn,
  LocalShipping,
  TrendingUp,
  ReceiptLong,
  ShoppingCart,
} from '@mui/icons-material';

interface MetricsGridProps {
  dashboardData: DashboardData | null;
  revenueData: RevenueSummary | null;
  loading: boolean;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({ dashboardData, revenueData, loading }) => {
  const router = useRouter();
  const metrics = [
    { title: 'Tổng số Import', value: dashboardData?.totalImports, icon: <Inventory />, path: '/dashboard/detail/imports' },
    {
      title: 'Tổng chi phí Nhập',
      value: dashboardData?.totalImportCost?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      icon: <MonetizationOn />,
      path: '/dashboard/detail/imports',
    },
    { title: 'Tổng số Dispatch', value: dashboardData?.totalDispatches, icon: <LocalShipping />, path: '/dashboard/detail/dispatches' },
    { title: 'Tổng số Transfer', value: dashboardData?.totalTransfers, icon: <TrendingUp />, path: '/dashboard/detail/transfers' },
    {
      title: 'Tổng doanh thu',
      value: revenueData?.totalRevenue?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }),
      icon: <MonetizationOn />,
      path: '/dashboard/detail/revenue',
    },
    { title: 'Số đơn hàng', value: revenueData?.totalOrders, icon: <ReceiptLong />, path: '/dashboard/detail/orders' },
    { title: 'Sản phẩm bán', value: revenueData?.totalProductsSold, icon: <ShoppingCart />, path: '/dashboard/detail/products' },
  ];

  return (
    <Grid container spacing={4} sx={{ mb: 8 }}>
      {metrics.map((m, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx}>
          {loading || m.value === undefined ? (
            <Skeleton variant="rectangular" width="100%" height={140} />
          ) : (
            <InfoCard title={m.title} value={m.value} icon={m.icon} onClick={() => router.push(m.path)} />
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default MetricsGrid;