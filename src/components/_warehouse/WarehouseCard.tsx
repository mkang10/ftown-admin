import React from 'react';
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Warehouse } from '@/type/WarehouseList';

interface Props {
  warehouse: Warehouse;
  onClick: (warehouse: Warehouse) => void;
}

const WarehouseCard: React.FC<Props> = ({ warehouse, onClick }) => (
  <Card
    onClick={() => onClick(warehouse)}
    elevation={3}
    sx={{
      cursor: 'pointer',
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'transform 0.2s',
      '&:hover': { transform: 'scale(1.03)' }
    }}
  >
    {warehouse.imagePath && (
      <CardMedia
        component="img"
        height="140"
        image={warehouse.imagePath}
        alt={warehouse.warehouseName}
      />
    )}

    <CardContent sx={{ flexGrow: 1 }}>
      <Typography variant="h6">
        {warehouse.warehouseName}
      </Typography>

      <Typography variant="body2" color="text.secondary">
        {warehouse.warehouseDescription}
      </Typography>

      <Typography variant="caption" display="block" mt={1}>
        Vị trí: {warehouse.location}
      </Typography>

      <Typography variant="caption" display="block">
        Ngày tạo: {new Date(warehouse.createdDate).toLocaleDateString()}
      </Typography>

      <Typography variant="body2" mt={1}>
        Loại kho: {warehouse.warehouseType}
      </Typography>

      <Typography variant="body2">
        Số điện thoại: {warehouse.phone}
      </Typography>

      <Typography variant="body1" fontWeight="bold" color="primary" mt={2}>
        Số lượng hàng hóa an toàn: {warehouse.safetyStock}
      </Typography>

      <Typography variant="body1" fontWeight="bold" color="error" mt={1}>
        Số lượng hàng hóa khẩn cấp: {warehouse.urgentSafetyStock}
      </Typography>
    </CardContent>
  </Card>
);

export default WarehouseCard;
