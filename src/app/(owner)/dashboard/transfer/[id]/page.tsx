"use client";

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Divider,
  Chip,
} from '@mui/material';
import { getTransferById } from '@/ultis/transferapi';
import TransferTab from '@/components/transfer/TransferTab';
import ImportTab from '@/components/transfer/ImportTab';
import DispatchTab from '@/components/transfer/DispatchTab';
import AuditLogsTab from '@/components/transfer/AuditLogsTab';
import { TransferResponseDto } from '@/type/transferdetail';

const TabPanel: React.FC<{ value: number; index: number; children?: React.ReactNode }> = ({ children, value, index }) => (
  <div role="tabpanel" hidden={value !== index}>
    {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
  </div>
);

const TransferDetailPage: React.FC = () => {
  const { id } = useParams();
  const [data, setData] = useState<TransferResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    getTransferById(Number(id))
      .then(setData)
      .catch((err) => setError(err.message || 'Lỗi tải dữ liệu'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading)
    return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error)
    return <Typography color="error" align="center" sx={{ mt: 10 }}>{error}</Typography>;
  if (!data)
    return <Typography align="center" sx={{ mt: 10 }}>Không tìm thấy dữ liệu.</Typography>;

  const { jsonTransfer, jsonImport, jsonDispatch, auditLogs } = data;

  return (
    <Box sx={{ p: 4, bgcolor: '#fafafa' }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#000' }}>
        Chi tiết Transfer #{jsonTransfer.transferOrderId}
      </Typography>
      <Divider sx={{ mb: 3, borderColor: '#eee' }} />

      <Paper sx={{ borderRadius: 1, boxShadow: 1, mb: 3, bgcolor: '#fff' }}>
        <Tabs
          value={tabIndex}
          onChange={(_, v) => setTabIndex(v)}
          textColor="inherit"
          indicatorColor="primary"
          centered
          sx={{ '& .MuiTab-root': { color: '#000' } }}
        >
          <Tab label="Chuyển kho" />
          <Tab label="Nhập kho" />
          <Tab label="Xuất Kho" />
          <Tab label="Lịch Sử" />
        </Tabs>
      </Paper>

      <TabPanel value={tabIndex} index={0}><TransferTab jsonTransfer={jsonTransfer} /></TabPanel>
      <TabPanel value={tabIndex} index={1}><ImportTab jsonImport={jsonImport} /></TabPanel>
      <TabPanel value={tabIndex} index={2}><DispatchTab jsonDispatch={jsonDispatch} /></TabPanel>
      <TabPanel value={tabIndex} index={3}><AuditLogsTab auditLogs={auditLogs} /></TabPanel>
    </Box>
  );
};

export default TransferDetailPage;