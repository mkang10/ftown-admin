import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Chip,
  Divider,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { DispatchDto } from '@/type/transferdetail';

interface DispatchTabProps {
  jsonDispatch: DispatchDto;
}

const DispatchTab: React.FC<DispatchTabProps> = ({ jsonDispatch }) => (
  <Card sx={{ mb: 3, borderRadius: 1, boxShadow: 1, bgcolor: '#fff' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ color: '#000' }}>
        Thông tin xuất kho
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Mã phiếu xuất
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {jsonDispatch.dispatchId}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Ngày tạo
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {new Date(jsonDispatch.createdDate).toLocaleString('vi-VN')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Trạng thái
          </Typography>
          <Chip variant="outlined" label={jsonDispatch.status.toUpperCase()} sx={{ borderColor: '#000', color: '#000' }} size="small" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Tham chiếu
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {jsonDispatch.referenceNumber}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, borderColor: '#eee' }} />
      <Typography variant="h6" gutterBottom sx={{ color: '#000' }}>
        Chi tiết xuất kho
      </Typography>
      {jsonDispatch.details.map((item) => (
        <Accordion key={item.dispatchDetailId} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#000' }} />}>
            <Typography sx={{ color: '#000' }}>
              Chi tiết #{item.dispatchDetailId}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" sx={{ color: '#555' }}>
                  Sản phẩm
                </Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>
                  {item.variantName}
                </Typography>
              </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                              <Typography variant="subtitle2" sx={{ color: '#555' }}>
                                Kích cỡ / Màu
                              </Typography>
                              <Typography variant="body2" sx={{ color: '#000' }}>
                                {item.sizeName} / {item.colorName}
                              </Typography>
                            </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" sx={{ color: '#555' }}>
                  Số lượng
                </Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>
                  {item.quantity}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" sx={{ color: '#555' }}>
                  Giá Xuất
                </Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>
                  0
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#555' }}>
                Chi tiết kho xuất
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#555' }}>Kho</TableCell>
                    <TableCell sx={{ color: '#555' }}>SL phân bổ</TableCell>
                    <TableCell sx={{ color: '#555' }}>Ghi chú</TableCell>
                    <TableCell sx={{ color: '#555' }}>Nhân viên</TableCell>
                    <TableCell sx={{ color: '#555' }}>Quản lý</TableCell>
                    <TableCell sx={{ color: '#555' }}>Trạng thái</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {item.storeExportDetail.map((row) => (
                    <TableRow key={row.dispatchStoreDetailId}>
                      <TableCell sx={{ color: '#000' }}>{row.warehouseName}</TableCell>
                      <TableCell sx={{ color: '#000' }}>{row.allocatedQuantity}</TableCell>
                      <TableCell sx={{ color: '#000' }}>{row.status}</TableCell>
                      <TableCell sx={{ color: '#000' }}>{row.staff}</TableCell>
                      <TableCell sx={{ color: '#000' }}>{row.handleBy}</TableCell>
                      <TableCell sx={{ color: '#000' }}>{row.comments}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </CardContent>
  </Card>
);

export default DispatchTab;