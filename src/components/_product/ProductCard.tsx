import React from 'react';
import { Card, CardActionArea, CardContent, CardMedia, Typography, Box } from '@mui/material';
import { Product } from '@/type/ProductList';

interface ProductCardProps {
  product: Product;
  cardStyle?: React.CSSProperties;
  onClick?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, cardStyle, onClick }) => (
  <Card
    onClick={onClick}
    elevation={1}
    sx={{
      // Cho card luôn chiếm hết không gian của Grid item
      width: '100%',
      transition: 'transform 0.3s, box-shadow 0.3s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: 6,
      },
      borderRadius: 2,
      display: 'flex',
      flexDirection: 'column',
      ...cardStyle,
    }}
  >
    <CardActionArea sx={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      {/* Ảnh sản phẩm */}
      {product.imagePath && (
        <CardMedia
          component="img"
          image={product.imagePath}
          alt={product.name}
          sx={{
            width: '100%',
            height: { xs: 200, sm: 300 },
            objectFit: 'cover',
            mb: 1,
          }}
        />
      )}

      <CardContent sx={{ p: 1.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Tên sản phẩm */}
        <Typography gutterBottom variant="subtitle1" noWrap>
          {product.name}
        </Typography>

        {/* Mô tả ngắn */}
       

        <Box sx={{ mt: 'auto' }}>
          {/* Thông tin phụ */}
          <Typography variant="caption" display="block">
            Danh mục: {product.categoryName}
          </Typography>
          <Typography variant="caption" display="block">
            Mã: {product.model}
          </Typography>
          <Typography variant="caption" display="block">
            Trạng thái: {product.status}
          </Typography>
        </Box>
      </CardContent>
    </CardActionArea>
  </Card>
);