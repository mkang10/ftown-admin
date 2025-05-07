"use client";
import React, { useState, useEffect, Suspense } from "react";
import dynamic from "next/dynamic";
import useSWR from "swr";
import { useParams, useRouter } from "next/navigation";
import {
  Box,
  Button,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

// Dynamic imports for heavy components
const CircularProgress = dynamic(() => import('@mui/material').then(mod => mod.CircularProgress), { ssr: false });
const Image = dynamic(() => import('next/image'), { ssr: false });

import { getProductVariantDetail } from "@/ultis/Productvar";
import { ProductDetailData } from "@/type/ProductVar";

// SWR fetcher
const fetcher = (variantId: number) => getProductVariantDetail(variantId).then(res => {
  if (res.status) return res.data;
  throw new Error(res.message);
});

const ProductDetailPage: React.FC = () => {
  const router = useRouter();
  const params = useParams() as { variantId?: string };
  const variantId = params.variantId ? parseInt(params.variantId, 10) : NaN;

  // Use SWR for caching & revalidation
  const { data: product, error } = useSWR(
    () => Number.isNaN(variantId) ? null : [variantId],
    () => fetcher(variantId),
    { revalidateOnFocus: false }
  );

  if (!product && !error) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {(error as Error).message}
      </Typography>
    );
  }

  if (!product) {
    return (
      <Typography align="center" mt={4}>
        Không tìm thấy chi tiết sản phẩm.
      </Typography>
    );
  }

  return (
    <Suspense fallback={<CircularProgress />}>
      <Card sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
        <CardContent>
          <Box sx={{ position: 'relative', width: '100%', height: 300, mb: 2 }}>
            <Image
              src={product.imagePath}
              alt={product.productName}
              fill
              style={{ objectFit: 'contain', borderRadius: 4 }}
            />
          </Box>
          <Typography variant="h5" gutterBottom>
            {product.productName}
          </Typography>
          <Typography gutterBottom>
            <strong>Kích thước:</strong> {product.sizeName} &nbsp;|&nbsp;
            <strong>Màu sắc:</strong> {product.colorName}
          </Typography>
          <Typography gutterBottom>
            <strong>Giá:</strong> {product.price.toLocaleString()}₫
          </Typography>
          <Typography gutterBottom>
            <strong>SKU:</strong> {product.sku}
          </Typography>
          {product.barcode && (
            <Typography gutterBottom>
              <strong>Barcode:</strong> {product.barcode}
            </Typography>
          )}
          {product.weight != null && (
            <Typography gutterBottom>
              <strong>Khối lượng:</strong> {product.weight}g
            </Typography>
          )}
          <Typography gutterBottom>
            <strong>Trạng thái:</strong> {product.status ?? "Không có thông tin"}
          </Typography>
          <Typography gutterBottom>
            <strong>Tồn kho tối đa:</strong> {product.maxStock ?? "Không có thông tin"}
          </Typography>
          <Box mt={3} display="flex" justifyContent="space-between">
            <Button variant="outlined" onClick={() => router.back()}>
              Quay lại
            </Button>
            <Button
              variant="contained"
              onClick={() => router.push(`/dashboard/variant/edit/${variantId}`)}
            >
              Chỉnh sửa biến thể
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Suspense>
  );
};

export default ProductDetailPage;
