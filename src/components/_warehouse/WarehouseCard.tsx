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
    {/* Ảnh kho nếu có đường dẫn */}
    {warehouse.imagePath && (
      <CardMedia
        component="img"
        height="140"
        image={warehouse.imagePath}
        alt={warehouse.warehouseName}
      />
    )}

    <CardContent sx={{ flexGrow: 1 }}>
      {/* Tên kho */}
      <Typography variant="h6">
        {warehouse.warehouseName}
      </Typography>

      {/* Mô tả kho */}
      <Typography variant="body2" color="text.secondary">
        {warehouse.warehouseDescription}
      </Typography>

      {/* Vị trí kho */}
      <Typography variant="caption" display="block" mt={1}>
        Vị trí: {warehouse.location}
      </Typography>

      {/* Ngày tạo */}
      <Typography variant="caption" display="block">
        Ngày tạo: {new Date(warehouse.createdDate).toLocaleDateString()}
      </Typography>
    </CardContent>
  </Card>
);

export default WarehouseCard;
