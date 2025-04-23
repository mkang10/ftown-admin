// components/WarehouseList.tsx
import React from 'react';
import { Grid } from '@mui/material';
import WarehouseCard from './WarehouseCard';
import { Warehouse } from '@/type/WarehouseList';

interface Props {
  warehouses: Warehouse[];
  onCardClick: (warehouse: Warehouse) => void;
}

const WarehouseList: React.FC<Props> = ({ warehouses, onCardClick }) => (
  <Grid container spacing={3}>
    {warehouses.map((wh) => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={wh.warehouseId}>
        <WarehouseCard warehouse={wh} onClick={onCardClick} />
      </Grid>
    ))}
  </Grid>
);

export default WarehouseList;