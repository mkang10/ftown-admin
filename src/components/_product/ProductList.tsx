import React from 'react';
import { Grid } from '@mui/material';
import { ProductCard } from './ProductCard';
import { Product } from '@/type/ProductList';

interface ProductListProps {
  products: Product[];
  cardStyle?: React.CSSProperties;
  onProductClick: (id: number) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, cardStyle, onProductClick }) => (
  <Grid container spacing={2} justifyContent="center">
    {products.map(product => (
      <Grid item xs={12} marginRight={2} sm={6} md={4} lg={3} key={product.productId}>
        <ProductCard
          product={product}
          cardStyle={cardStyle}
          onClick={() => onProductClick(product.productId)}
        />
      </Grid>
    ))}
  </Grid>
);
