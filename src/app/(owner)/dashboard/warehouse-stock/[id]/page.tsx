import React from 'react';
import WarehouseStockDetailClient from '@/components/_warehousestock/WarehouseStockDetailClient';

interface PageProps {
  params: { id: string };
}

export default function WarehouseStockDetailPage({ params }: PageProps) {
  const id = Number(params.id);
  return <WarehouseStockDetailClient id={id} />;
}
