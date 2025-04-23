"use client";
// File: src/pages/ProductPage.tsx
import React, { useState, useEffect } from 'react';
import { Box, Button, Divider, Pagination, Typography } from '@mui/material';
import { fetchProducts } from '@/ultis/Product';
import { Product } from '@/type/ProductList';
import { ProductFilter } from '@/components/_product/ProductFilter';
import { ProductList } from '@/components/_product/ProductList';
import { CreateProductModal } from '@/components/_product/CreateProductModal';
import AddIcon from '@mui/icons-material/Add';
import { useRouter } from 'next/navigation';

const defaultPageSize = 8;


export default function ProductPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [totalRecords, setTotalRecords] = useState(0);
    const [page, setPage] = useState(1);
    const [pageSize] = useState(defaultPageSize);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [openCreate, setOpenCreate] = useState(false);
    const router = useRouter();


    const handleProductClick = (id: number) => {
      router.push(`/dashboard/product/${id}`);
    };
    useEffect(() => {
      const load = async () => {
        const { data, totalRecords } = await fetchProducts({ page, pageSize, ...filters });
        setProducts(data);
        setTotalRecords(totalRecords);
      };
      load();
    }, [page, filters ]);
  
    const handleFilterChange = (key: string, value: any) => {
      setFilters(prev => ({ ...prev, [key]: value }));
      setPage(1);
    };
  
    const handleSuccess = () => {
      setPage(1);
    };
  
    return (
      <Box sx={{ p: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h4">Quản lý sản phẩm</Typography>
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenCreate(true)}>Tạo mới</Button>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <ProductFilter filters={filters} onChange={handleFilterChange} />
        <ProductList products={products} cardStyle={{ width: 300, height: 480 }} onProductClick={handleProductClick} />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination count={Math.ceil(totalRecords / pageSize)} page={page} onChange={(_, v) => setPage(v)} color="primary" size="small" />
        </Box>
        <CreateProductModal open={openCreate} onClose={() => setOpenCreate(false)} onSuccess={handleSuccess} />
      </Box>
    );
  }
  