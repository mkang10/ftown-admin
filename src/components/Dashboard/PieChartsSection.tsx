import React from 'react';
import { Grid, Skeleton } from '@mui/material';
import StatusPieChart, { StatusCount } from '@/components/Dashboard/StatusPieChart';
import { DashboardData } from '@/type/dashboard';

interface PieChartsSectionProps {
  data: DashboardData;
  loading: boolean;
}

const PieChartsSection: React.FC<PieChartsSectionProps> = ({ data, loading }) => {
  const charts = [
    { title: 'Tỷ lệ trạng thái Import', data: data.importStatusCounts },
    { title: 'Tỷ lệ trạng thái Dispatch', data: data.dispatchStatusCounts },
    { title: 'Tỷ lệ trạng thái Transfer', data: data.transferStatusCounts },
  ];

  return (
    <Grid container spacing={4}>
      {charts.map((c, idx) => (
        <Grid item xs={12} md={4} key={idx}>
          {loading ? (
            <Skeleton variant="rectangular" width="100%" height={240} />
          ) : (
            <StatusPieChart title={c.title} data={c.data as StatusCount[]} />
          )}
        </Grid>
      ))}
    </Grid>
  );
};

export default PieChartsSection;
