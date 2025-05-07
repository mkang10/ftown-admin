"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import {
    Box,
    Typography,
    Grid,
    Button,
    CircularProgress,
    Collapse,
    IconButton,
    Stack,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, Variant } from '@/type/ProductDetail';
import { fetchProductDetail } from '@/ultis/Product';
import { FiInfo } from 'react-icons/fi';

// Dynamic import carousel for faster initial load
const Carousel = dynamic(
  () => import('react-material-ui-carousel'),
  { ssr: false, loading: () => <CircularProgress size={48} /> }
);

export default function ProductDetailPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const id = useMemo(() => Number(params.id), [params.id]);
    const [product, setProduct] = useState<Product | null>(null);
    const [variants, setVariants] = useState<Variant[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [openVariants, setOpenVariants] = useState<Record<number, boolean>>({});

    useEffect(() => {
        if (!id) return;
        setLoading(true);
        fetchProductDetail(id)
            .then(res => {
                if (res.status) {
                    setProduct(res.data.product);
                    setVariants(res.data.variants);
                } else {
                    setError(res.message);
                }
            })
            .catch(() => setError('Error loading product'))
            .finally(() => setLoading(false));
    }, [id]);

    const toggleVariant = React.useCallback((variantId: number) => {
        setOpenVariants(prev => ({ ...prev, [variantId]: !prev[variantId] }));
    }, []);

    if (loading) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{ p: 4 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!product) return null;

    return (
        <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '1200px', mx: 'auto' }}>
            <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Button onClick={() => router.back()} startIcon={<ArrowBackIcon />}>
                    Quay lại
                </Button>
                <Stack direction="row" spacing={2}>
                    <Button
                        variant="outlined"
                        onClick={() => router.push(`/dashboard/product/create-variant/${id}`)}
                    >
                        Tạo biến thể
                    </Button>
                    <Button
                        onClick={() => router.push(`/dashboard/product/edit/${id}`)}
                        startIcon={<EditIcon />}
                        variant="contained"
                        color="primary"
                    >
                        Chỉnh sửa
                    </Button>
                </Stack>
            </Stack>

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Typography variant="h4" gutterBottom fontWeight={700}>
                    {product.name}
                </Typography>

                {/* Carousel for product images */}
                {product.image?.length ? (
                    <Carousel autoPlay={false} navButtonsAlwaysVisible indicators={Boolean(product.image.length > 1)} animation="slide">
                        {product.image.map((img, idx) => (
                            <Box key={img.productImageId} sx={{ position: 'relative', width: '100%', height: 400, mb: 2 }}>
                                <Image
                                    src={img.imagePath}
                                    alt={`${product.name} - ${idx + 1}`}
                                    fill
                                    style={{ objectFit: 'contain' }}
                                />
                            </Box>
                        ))}
                    </Carousel>
                ) : product.imagePath ? (
                    <Box sx={{ position: 'relative', width: '100%', height: 400, mb: 2 }}>
                        <Image
                            src={product.imagePath}
                            alt={product.name}
                            fill
                            style={{ objectFit: 'contain' }}
                        />
                    </Box>
                ) : null}

                <Typography variant="body1" gutterBottom>{product.description}</Typography>
                <Typography variant="subtitle2">Category: {product.categoryName}</Typography>
                <Typography variant="subtitle2">Model: {product.model}</Typography>
                <Typography variant="subtitle2">Status: {product.status}</Typography>
            </motion.div>

            <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom fontWeight={700}>Variants</Typography>

                <AnimatePresence>
                    <Grid container spacing={2}>
                        {variants.map((v, index) => (
                            <Grid item key={v.variantId} xs={12} sm={6} md={4}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    exit={{ opacity: 0, y: 20 }}
                                >
                                    <Box
                                        sx={{
                                            border: '1px solid #eee',
                                            p: 2,
                                            borderRadius: 2,
                                            background: '#fff',
                                            '&:hover': { boxShadow: 4, transform: 'translateY(-4px) scale(1.02)' },
                                        }}
                                    >
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Typography variant="subtitle1" fontWeight={600}>SKU: {v.sku}</Typography>
                                            <IconButton onClick={() => toggleVariant(v.variantId)}>
                                                <ExpandMoreIcon
                                                    sx={{ transform: openVariants[v.variantId] ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}
                                                />
                                            </IconButton>
                                        </Box>

                                        <Collapse in={openVariants[v.variantId]}>  
                                            <Box mt={2} sx={{ position: 'relative', width: '100%', paddingTop: '66.66%', borderRadius: 2, overflow: 'hidden' }}>
                                                <Image
                                                    src={v.imagePath}
                                                    alt={v.sku}
                                                    fill
                                                    style={{ objectFit: 'cover' }}
                                                />
                                            </Box>

                                            <Typography mt={1} fontWeight={600}>Giá: {v.price.toLocaleString()}₫</Typography>

                                            <Button
                                                variant="outlined"
                                                startIcon={<FiInfo />}
                                                sx={{ mt: 1 }}
                                                onClick={() => router.push(`/dashboard/productdetail/${v.variantId}`)}
                                            >
                                                Chi tiết sản phẩm
                                            </Button>
                                        </Collapse>
                                    </Box>
                                </motion.div>
                            </Grid>
                        ))}
                    </Grid>
                </AnimatePresence>
            </Box>
        </Box>
    );
}
