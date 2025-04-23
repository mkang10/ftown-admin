"use client";
import React, { useState, useEffect , useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import {
  Box,
  CircularProgress,
  Typography,
  Button,
  Paper,
  Divider,
} from '@mui/material';

import ProductDetailsForm from '@/components/_editproduct/ProductDetailsForm';
import ExistingImagesCarousel, { Image as ExistingImage } from '@/components/_editproduct/ExistingImagesCarousel';
import NewImagesUploader, { NewImage } from '@/components/_editproduct/NewImagesUploader';
import { fetchProductDetail, updateProduct } from '@/ultis/Product';
import { fetchCategories } from '@/ultis/categoryapi';
import { ApiResponse } from '@/type/apiResponse';
import { ProductDetailResponse } from '@/type/ProductDetail';
import { Category } from '@/type/category';
import { UpdateProductRequest } from '@/type/UpdateProductResponse';

export default function ProductEditPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const id = Number(params.id);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [newImages, setNewImages] = useState<NewImage[]>([]);

  const loadProduct = useCallback(async () => {
    setLoading(true);
    try {
      const res = (await fetchProductDetail(id)) as ProductDetailResponse;
      if (res.status) {
        const p = res.data.product as any;
        setFormData({
          name: p.name,
          description: p.description,
          categoryId: p.categoryId,
          origin: p.origin,
          model: p.model,
          occasion: p.occasion,
          style: p.style,
          material: p.material,
          status: p.status,
        });

        let imgs: ExistingImage[] = [];
        if (p.image && p.image.length > 0) {
          imgs = p.image.map((img: any) => ({
            productImageId: img.productImageId,
            url: img.imagePath,
            isMain: img.isMain,
          }));
        } else if (p.imagePath) {
          imgs = [
            {
              productImageId: 0,
              url: p.imagePath,
              isMain: true,
            },
          ];
        }
        setExistingImages(imgs);
        setNewImages([]);
      } else {
        toast.error(res.message);
        setError(res.message);
      }
    } catch {
      toast.error('Lỗi tải thông tin sản phẩm');
      setError('Lỗi tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  }, [id]); // ← id làm dependency

  useEffect(() => {
    loadProduct();             // gọi loadProduct
    (async () => {
      try {
        const res = (await fetchCategories()) as ApiResponse<Category[]>;
        if (res.status) setCategories(res.data);
        else toast.error(res.message);
      } catch {
        toast.error('Lỗi tải danh mục');
      }
    })();
  }, [id, loadProduct]);

  const handleToggleExistingMain = (imgId: number) => {
    setExistingImages(prev =>
      prev.map(img => ({ ...img, isMain: img.productImageId === imgId }))
    );
    setNewImages(prev => prev.map(img => ({ ...img, isMain: false })));
  };

  const handleDeleteExisting = (imgId: number) => {
    setExistingImages(prev => prev.filter(img => img.productImageId !== imgId));
    setDeletedImageIds(prev => [...prev, imgId]);
  };

  const handleToggleNewMain = (index: number) => {
    setNewImages(prev => prev.map((img, i) => ({ ...img, isMain: i === index })));
    setExistingImages(prev => prev.map(img => ({ ...img, isMain: false })));
  };

  const handleDeleteNew = (index: number) => {
    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.categoryId) return toast.error('Vui lòng chọn danh mục');

    const payload: UpdateProductRequest = {
      Name: formData.name,
      Description: formData.description,
      CategoryId: formData.categoryId,
      Origin: formData.origin,
      Model: formData.model,
      Occasion: formData.occasion,
      Style: formData.style,
      Material: formData.material,
      Status: formData.status,
      ExistingImages: existingImages.map(img => ({
        productImageId: img.productImageId,
        isMain: img.isMain,
      })),
      NewImages: newImages.map(img => ({
        imageFile: img.file,
        isMain: img.isMain,
      })),
    };

    const totalMain = [...existingImages, ...newImages].filter(img => img.isMain);
    if (totalMain.length !== 1) {
      return toast.error('Vui lòng chọn một ảnh chính duy nhất');
    }

    setSubmitting(true);
    try {
      const res = await updateProduct(id, payload);
      if (res.status) {
        toast.success('Cập nhật thành công');
        await loadProduct();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Lỗi khi lưu sản phẩm');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return <Box sx={{ p: 4, textAlign: 'center' }}><CircularProgress /></Box>;
  if (error)
    return <Box sx={{ p: 4 }}><Typography color="error">{error}</Typography></Box>;

  return (
    <Box sx={{ width: '100%', maxWidth: '100%', p: { xs: 2, sm: 4 }, backgroundColor: '#fff' }}>
      <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3, borderRadius: 3, boxShadow: 4, backgroundColor: '#fff' }}>
        <Typography variant="h4" fontWeight="bold" textAlign="center" gutterBottom>
          🎨 Chỉnh sửa sản phẩm
        </Typography>
        <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
          <ProductDetailsForm data={formData} categories={categories} onChange={setFormData} />
        </Paper>
        <Divider textAlign="left" sx={{ mb: 2 }}>Ảnh hiện có</Divider>
        <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
          <ExistingImagesCarousel
            images={existingImages}
            onToggleMain={handleToggleExistingMain}
            onDelete={handleDeleteExisting}
          />
        </Paper>
        <Divider textAlign="left" sx={{ mb: 2 }}>Thêm ảnh mới</Divider>
        <Paper elevation={2} sx={{ p: 2, mb: 3, backgroundColor: '#f9f9f9', borderRadius: 2 }}>
          <NewImagesUploader
            images={newImages}
            onAdd={files => setNewImages(prev => [...prev, ...files])}
            onToggleMain={handleToggleNewMain}
            onDelete={handleDeleteNew}
          />
        </Paper>
        <Button
          fullWidth
          variant="contained"
          onClick={handleSubmit}
          disabled={submitting}
          sx={{ mt: 2, backgroundColor: '#000', color: '#fff', '&:hover': { backgroundColor: '#333' } }}
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : '💾 Lưu thay đổi'}
        </Button>
      </Box>
    </Box>
  );
}