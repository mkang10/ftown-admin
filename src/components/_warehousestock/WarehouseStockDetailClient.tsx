'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Stack,
  Divider,
  Chip,
  IconButton,
  Collapse,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import InventoryIcon from '@mui/icons-material/Inventory';
import HistoryEduIcon from '@mui/icons-material/HistoryEdu';
import { WarehouseStockDetail } from '@/type/warehousestockdetail';
import { fetchWarehouseStockDetail } from '@/ultis/warehouseapi';

interface Props {
  id: number;
}

export default function WarehouseStockDetailClient({ id }: Props) {
  const [detail, setDetail] = useState<WarehouseStockDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [auditOpen, setAuditOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resp = await fetchWarehouseStockDetail(id);
        setDetail(resp.data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Không tìm thấy dữ liệu với ID = ' + id);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) {
    return <Container sx={{ mt: 4 }}>Đang tải...</Container>;
  }

  if (error || !detail) {
    return (
      <Container sx={{ mt: 4 }}>
        <Typography variant="h6" color="error">
          {error || `Không tìm thấy dữ liệu với ID = ${id}`}
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Box display="flex" alignItems="center" mb={3}>
        <InventoryIcon fontSize="large" color="primary" />
        <Typography variant="h4" ml={2}>
          {detail.variantName}
        </Typography>
      </Box>

      <Card sx={{ p: 3, mb: 4, boxShadow: 3, borderRadius: 3 }}>
        <Stack direction="row" spacing={4}>
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Kho lưu trữ
            </Typography>
            <Typography variant="h6">{detail.wareHouseName}</Typography>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              Số lượng hiện tại
            </Typography>
            <Typography variant="h6" color="primary">
              {detail.stockQuantity}
            </Typography>
          </Box>
        </Stack>
      </Card>

      {/* Lịch sử audit - Bọc ngoài cùng */}
      <Card variant="outlined" sx={{ p: 3, borderRadius: 3 }}>
        <Box
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          onClick={() => setAuditOpen(!auditOpen)}
          sx={{ cursor: 'pointer' }}
        >
          <Box display="flex" alignItems="center">
            <HistoryEduIcon color="action" />
            <Typography variant="h6" ml={1}>
              Lịch sử điều chỉnh
            </Typography>
          </Box>
          <IconButton size="small">
            {auditOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={auditOpen}>
          <Stack spacing={2} mt={2}>
            {detail.auditHistory.map((a) => {
              const isNegative =
                a.quantityChange.toString().trim().startsWith('-');
              const borderColor = isNegative ? '#f44336' : '#4caf50';
              const label = isNegative ? 'Xuất hàng' : 'Nhập hàng';
              const chipColor = isNegative ? 'error' : 'success';

              return (
                <Card
                  key={a.auditId}
                  sx={{
                    borderLeft: `6px solid ${borderColor}`,
                    boxShadow: 1,
                    borderRadius: 2,
                    backgroundColor: '#fdfdfd',
                    px: 2,
                  }}
                >
                  <CardContent>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Chip
                          label={label}
                          color={chipColor}
                          variant="outlined"
                        />
                        <Typography fontWeight="bold">
                          {a.changedByName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(a.actionDate).toLocaleString()}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Typography variant="subtitle2" mt={2}>
                      Số lượng thay đổi:
                    </Typography>
                    <Typography
                      variant="h6"
                      color={isNegative ? 'red' : 'green'}
                    >
                      {a.quantityChange} sản phẩm
                    </Typography>

                    <Typography variant="subtitle2" mt={2}>
                      Ghi chú:
                    </Typography>
                    <Typography variant="body2">
                      {a.note || 'Không có ghi chú'}
                    </Typography>
                  </CardContent>
                </Card>
              );
            })}
          </Stack>
        </Collapse>
      </Card>
    </Container>
  );
}
