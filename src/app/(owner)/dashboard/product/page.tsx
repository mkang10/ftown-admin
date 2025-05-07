"use client";
// File: src/pages/ProductPage.tsx
import React, { useState, useEffect, useMemo } from 'react';
import { Box, Button, Divider, Pagination, Typography, Skeleton } from '@mui/material';
import dynamic from 'next/dynamic';
import { fetchProducts } from '@/ultis/Product';
import { Product } from '@/type/ProductList';
import { ProductFilter } from '@/components/_product/ProductFilter';
import { ProductList } from '@/components/_product/ProductList';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';
import debounce from 'lodash/debounce';

const defaultPageSize = 9;

// Dynamic import the default export or named component properly
const CreateProductModal = dynamic(
  () => import('@/components/_product/CreateProductModal').then(mod => mod.CreateProductModal),
  { ssr: false }
);

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(defaultPageSize);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [openCreate, setOpenCreate] = useState(false);
  const router = useRouter();

  const handleProductClick = (id: number) => {
    router.push(`/dashboard/product/${id}`);
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { data, totalRecords } = await fetchProducts({ page, pageSize, ...filters });
        setProducts(data);
        setTotalRecords(totalRecords);
      } catch (error) {
        console.error('Failed to fetch products', error);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [page, filters]);

  // Debounced filter setter
  const debouncedSetFilters = useMemo(
    () => debounce((key: string, value: any) => {
      setFilters(prev => ({ ...prev, [key]: value }));
      setPage(1);
    }, 300), []
  );

  const handleFilterChange = (key: string, value: any) => {
    debouncedSetFilters(key, value);
  };

  const handleSuccess = () => {
    setPage(1);
  };

  return (
    <Box sx={{ p: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Quản lý sản phẩm</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>
          Tạo mới
        </Button>
      </Box>
      <Divider sx={{ mb: 2 }} />

      <ProductFilter filters={filters} onChange={handleFilterChange} />

      {loading ? (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
          {Array.from({ length: pageSize }).map((_, idx) => (
            <Skeleton key={idx} variant="rectangular" width={300} height={480} />
          ))}
        </Box>
      ) : (
        <ProductList
          products={products}
          cardStyle={{ width: 300, height: 480 }}
          onProductClick={handleProductClick}
        />
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination
          count={Math.ceil(totalRecords / pageSize)}
          page={page}
          onChange={(_, v) => setPage(v)}
          color="primary"
          size="small"
        />
      </Box>

      <CreateProductModal
        open={openCreate}
        onClose={() => setOpenCreate(false)}
        onSuccess={handleSuccess}
      />
    </Box>
  );
}