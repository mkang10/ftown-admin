"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Chip,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { getDispatchById } from "@/ultis/dispatch";
import { DispatchDetail, DispatchResponseDto } from "@/type/dispatchdetail";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} style={{ width: '100%' }}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

const DispatchDetailPage: React.FC = () => {
  const params = useParams();
  const id = Number(params?.id);
  const [data, setData] = useState<DispatchResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    getDispatchById(id)
      .then(setData)
      .catch((err) => setError(err.message || "Lỗi tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
  if (error) return <Typography color="error" align="center" mt={10}>{error}</Typography>;
  if (!data) return <Typography align="center" mt={10}>Không tìm thấy dữ liệu Dispatch.</Typography>;

  const { jsonDispatchGet, auditLogs } = data;
  const {
    dispatchId,
    createdByUser,
    createdDate,
    status,
    referenceNumber,
    remarks,
    originalId,
    completedDate,
    details,
  } = jsonDispatchGet;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Chi tiết Dispatch #{dispatchId}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Paper sx={{ borderRadius: 2, boxShadow: 3, mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Chi tiết" />
          <Tab label="Sản phẩm" />
          <Tab label="Lịch sử thay đổi" />
        </Tabs>

      </Paper>

      <TabPanel value={tabIndex} index={0}>
        <Card sx={{ mb: 3, p: 2, borderRadius: 2, boxShadow: 1 }}>
          <Grid container spacing={2}>
            {[
              ['Mã Dispatch', dispatchId],
              ['Người tạo', createdByUser],
              ['Ngày tạo', new Date(createdDate).toLocaleString()],
              ['Trạng thái', status],
              ['Mã tham chiếu', referenceNumber],
              ['Ghi chú', remarks || '-'],
              ['Mã gốc', originalId ?? '-'],
              ['Ngày hoàn tất', completedDate ?? '-'],
            ].map(([label, val]) => (
              <Grid item xs={12} sm={6} md={4} key={label.toString()}>
                <Typography variant="subtitle2" color="text.secondary">{label}</Typography>
                {label === 'Trạng thái'
                  ? <Chip label={String(val)} color={val === 'Done' ? 'success' : 'default'} size="small" />
                  : <Typography variant="body1">{val}</Typography>
                }
              </Grid>
            ))}
          </Grid>
        </Card>

      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <Typography variant="h6" gutterBottom>Danh sách sản phẩm</Typography>
        <Table>
          <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
            <TableRow>
              <TableCell>ID Chi tiết</TableCell>
              <TableCell>Biến thể</TableCell>
              <TableCell align="right">Số lượng</TableCell>
              <TableCell align="right">Đơn giá</TableCell>
              <TableCell>Kho xuất</TableCell>
              <TableCell align="right">Đã phân bổ</TableCell>
              <TableCell>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {details.map((d: DispatchDetail) => (
              <TableRow key={d.dispatchDetailId} hover>
                <TableCell>{d.dispatchDetailId}</TableCell>
                <TableCell>{d.variantName}</TableCell>
                <TableCell align="right">{d.quantity}</TableCell>
                <TableCell align="right">{0} VND</TableCell>
                <TableCell>{d.storeExportDetail[0]?.warehouseName}</TableCell>
                <TableCell align="right">{d.storeExportDetail[0]?.allocatedQuantity}</TableCell>
                <TableCell>
                  <Chip label={d.storeExportDetail[0]?.status.trim()} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <Typography variant="h6" gutterBottom>Lịch sử thay đổi</Typography>
        {auditLogs.length === 0 ? (
          <Typography>Không có bản ghi thay đổi.</Typography>
        ) : auditLogs.map((log) => (
          <Card key={log.auditLogId} sx={{ mb: 2, p: 2, borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              {log.operation} bởi {log.changedByName} lúc {new Date(log.changeDate).toLocaleString()}
            </Typography>
            {log.comment && <Typography variant="body2" mt={1}>{log.comment}</Typography>}
          </Card>
        ))}

      </TabPanel>
    </Box>
  );
};

export default DispatchDetailPage;
