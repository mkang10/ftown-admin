'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';     // <-- với app directory 
// import { useRouter } from 'next/router';       // <-- nếu bạn vẫn dùng pages directory
import {
  Box,
  TextField,
  Pagination,
  CircularProgress,
  Typography,
  Button
} from '@mui/material';
import WarehouseList from '@/components/_warehouse/WarehouseList';
import CreateWarehouseModal from '@/components/_warehouse/CreateWarehouseModal';
import StockModal from '@/components/_warehouse/StockModal';
import { fetchWarehouses } from '@/ultis/warehouseapi';
import { Warehouse } from '@/type/WarehouseList';

const WarehousePage: React.FC = () => {
  const router = useRouter();                   // <-- khởi tạo router
  const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const pageSize = 10;
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [stockOpen, setStockOpen] = useState(false);
  const [selected, setSelected] = useState<{ id: number; name: string }>({ id: 0, name: '' });

  const load = async () => {
    setLoading(true);
    try {
      const { data, totalRecords } = await fetchWarehouses(page, pageSize, search);
      setWarehouses(data);
      setTotalRecords(totalRecords);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [page, search]);

  const handleCardClick = (wh: Warehouse) => {
    setSelected({ id: wh.warehouseId, name: wh.warehouseName });
    setStockOpen(true);
  };

  return (
    <Box p={4}>
      <Box mb={2} display="flex" justifyContent="space-between">
        <TextField
          fullWidth
          label="Search"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
        <Button
          onClick={() => setCreateOpen(true)}
          variant="contained"
          sx={{ ml: 2 }}
        >
          Add Warehouse
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : warehouses.length === 0 ? (
        <Typography>No warehouses found.</Typography>
      ) : (
        <WarehouseList
          warehouses={warehouses}
          onCardClick={handleCardClick}
        />
      )}

      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={Math.ceil(totalRecords / pageSize)}
          page={page}
          onChange={(_, v) => setPage(v)}
        />
      </Box>

      <CreateWarehouseModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={load}
      />

      <StockModal
        open={stockOpen}
        onClose={() => setStockOpen(false)}
        warehouseId={selected.id}
        warehouseName={selected.name}
        onRowClick={(stockId) => {
          // Điều hướng đến trang detail của stockId
          router.push(`/dashboard/warehouse-stock/${stockId}`);
        }}
      />
    </Box>
  );
};

export default WarehousePage;
