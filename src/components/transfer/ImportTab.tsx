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
import { ImportDto } from '@/type/transferdetail';

interface ImportTabProps {
  jsonImport: ImportDto;
}

const ImportTab: React.FC<ImportTabProps> = ({ jsonImport }) => (
  <Card sx={{ mb: 3, borderRadius: 1, boxShadow: 1, bgcolor: '#fff' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ color: '#000' }}>
        Thông tin nhập kho
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Mã phiếu nhập
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {jsonImport.importId}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Ngày tạo
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {new Date(jsonImport.createdDate).toLocaleString('vi-VN')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Ngày Phê Duyệt
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {new Date(jsonImport.approvedDate).toLocaleString('vi-VN')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Trạng thái
          </Typography>
          <Chip variant="outlined" sx={{ borderColor: '#000', color: '#000' }} label={jsonImport.status.toUpperCase()} size="small" />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Tham chiếu
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {jsonImport.referenceNumber}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Tổng chi phí
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {jsonImport.totalCost}
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3, borderColor: '#eee' }} />
      <Typography variant="h6" gutterBottom sx={{ color: '#000' }}>
        Chi tiết nhập kho
      </Typography>
      {jsonImport.details.map((item) => (
        <Accordion key={item.importDetailId} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#000' }} />}>
            <Typography sx={{ color: '#000' }}>
              Chi tiết #{item.importDetailId}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" sx={{ color: '#555' }}>
                  Sản phẩm
                </Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>
                  {item.product}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" sx={{ color: '#555' }}>
                  Kích cỡ / Màu
                </Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>
                  {item.size} / {item.color}
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
                  Giá vốn
                </Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>
                  {item.costPrice}
                </Typography>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2 }}>
              <Typography variant="subtitle2" gutterBottom sx={{ color: '#555' }}>
                Chi tiết kho
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ color: '#555' }}>Kho</TableCell>
                    <TableCell sx={{ color: '#555' }}>SL phân bổ</TableCell>
                    <TableCell sx={{ color: '#555' }}>Trạng thái</TableCell>
                    <TableCell sx={{ color: '#555' }}>Nhân viên</TableCell>
                    <TableCell sx={{ color: '#555' }}>Quản lý</TableCell>
                    <TableCell sx={{ color: '#555' }}>Ghi chú</TableCell>
         

                  </TableRow>
                </TableHead>
                <TableBody>
                  {item.storeImportDetail.map((row) => (
                    <TableRow key={row.importStoreId}>
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

export default ImportTab;