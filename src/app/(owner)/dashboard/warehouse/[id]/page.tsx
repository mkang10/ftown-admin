// pages/warehouse/[id].tsx
"use client"
import React from 'react';
import { useRouter } from 'next/router';
import StockModal from '@/components/_warehouse/StockModal';

const WarehouseStockPage: React.FC = () => {
  const router = useRouter();
  const { id, name } = router.query;
  const warehouseId = Number(id);
  const warehouseName = String(name || '');

  if (!router.isReady || !warehouseId) return null;

  const handleRowClick = (stockId: number) => {
    router.push({
      pathname: '/warehouse-stock/[id]',
      query: { id: stockId }
    });
  };

  return (
    <StockModal
      open
      onClose={() => router.back()}
      warehouseId={warehouseId}
      warehouseName={warehouseName}
      onRowClick={handleRowClick}
    />
  );
};

export default WarehouseStockPage;
