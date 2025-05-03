import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Divider,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TransferDto } from '@/type/transferdetail';

interface TransferTabProps {
  jsonTransfer: TransferDto;
}

const TransferTab: React.FC<TransferTabProps> = ({ jsonTransfer }) => (
  <Card sx={{ mb: 3, borderRadius: 1, boxShadow: 1, bgcolor: '#fff' }}>
    <CardContent>
      <Typography variant="h6" gutterBottom sx={{ color: '#000' }}>
        Thông tin chuyển kho
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Mã phiếu chuyển kho
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {jsonTransfer.transferOrderId}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Mã phiếu nhập
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {jsonTransfer.importId}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Mã phiếu xuất
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {jsonTransfer.dispatchId}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Người tạo đơn
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {jsonTransfer.createdBy || '-'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Ngày tạo
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {new Date(jsonTransfer.createdDate).toLocaleString('vi-VN')}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Trạng thái
          </Typography>
          <Chip
            label={jsonTransfer.status.toUpperCase()}
            variant="outlined"
            size="small"
            sx={{ borderColor: '#000', color: '#000' }}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="subtitle2" sx={{ color: '#555' }}>
            Ghi chú
          </Typography>
          <Typography variant="body1" sx={{ color: '#000' }}>
            {jsonTransfer.remarks || '-'}
          </Typography>
        </Grid>
        {jsonTransfer.originalTransferOrderId && (
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="subtitle2" sx={{ color: '#555' }}>
              Phiếu gốc
            </Typography>
            <Typography variant="body1" sx={{ color: '#000' }}>
              {jsonTransfer.originalTransferOrderId}
            </Typography>
          </Grid>
        )}
      </Grid>

      <Divider sx={{ my: 3, borderColor: '#eee' }} />
      <Typography variant="h6" gutterBottom sx={{ color: '#000' }}>
        Chi tiết chuyển kho
      </Typography>
      {jsonTransfer.detailsTransferOrder.map((d) => (
        <Accordion key={d.transferOrderDetailId} disableGutters>
          <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: '#000' }} />}>
            <Typography fontWeight={600} sx={{ color: '#000' }}>
              Chi tiết #{d.transferOrderDetailId}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" sx={{ color: '#555' }}>
                  Sản phẩm
                </Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>
                  {d.product}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" sx={{ color: '#555' }}>
                  Màu / Kích cỡ
                </Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>
                  {d.color} / {d.size}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={4}>
                <Typography variant="subtitle2" sx={{ color: '#555' }}>
                  Số lượng
                </Typography>
                <Typography variant="body2" sx={{ color: '#000' }}>
                  {d.quantity}
                </Typography>
              </Grid>
            
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </CardContent>
  </Card>
);

export default TransferTab;