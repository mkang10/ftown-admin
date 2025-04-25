import React from 'react';
import { Box, TextField, Grid } from '@mui/material';

interface OrderFilterBarProps {
  fromDate: string;
  toDate: string;
  onFromChange: (value: string) => void;
  onToChange: (value: string) => void;
  loading: boolean;
}

const OrderFilterBar: React.FC<OrderFilterBarProps> = ({
  fromDate,
  toDate,
  onFromChange,
  onToChange,
  loading,
}) => {
  return (
    <Box mb={4}>
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12} sm={5} md={4}>
          <TextField
            fullWidth
            label="Từ ngày"
            type="date"
            value={fromDate}
            onChange={(e) => onFromChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
        </Grid>
        <Grid item xs={12} sm={5} md={4}>
          <TextField
            fullWidth
            label="Đến ngày"
            type="date"
            value={toDate}
            onChange={(e) => onToChange(e.target.value)}
            InputLabelProps={{ shrink: true }}
            disabled={loading}
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default OrderFilterBar;
