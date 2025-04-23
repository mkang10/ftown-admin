"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, CircularProgress, Typography, Card, CardContent, Box } from "@mui/material";
import { getProductVariantDetail } from "@/ultis/Productvar";
import { ProductDetailData } from "@/type/ProductVar";

const ProductDetailPage: React.FC = () => {
  const router = useRouter();
  // Lấy variantId từ đường dẫn /dashboard/productdetail/[variantId]
  const params = useParams() as { variantId?: string };
  const variantId = params.variantId ? parseInt(params.variantId, 10) : null;

  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (variantId === null || isNaN(variantId)) {
      setError("Không tìm thấy ID biến thể trong URL");
      setLoading(false);
      return;
    }

    getProductVariantDetail(variantId)
      .then((res) => {
        if (res.status) {
          setProduct(res.data);
        } else {
          setError(res.message);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Lỗi khi lấy chi tiết biến thể");
      })
      .finally(() => setLoading(false));
  }, [variantId]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" mt={4}>
        {error}
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
    <Card sx={{ maxWidth: 600, mx: "auto", mt: 4, p: 2 }}>
      <CardContent>
        <Box component="img"
          src={product.imagePath}
          alt={product.productName}
          sx={{ width: '100%', borderRadius: 1, mb: 2 }}
        />
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
  );
};

export default ProductDetailPage;