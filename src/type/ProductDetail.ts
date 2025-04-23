export interface Product {
    productId: number;
    name: string;
    description: string;
    categoryName: string;
    model: string;
    status: string;
    imagePath: string | null;
    image :Image[]
  }

  export interface Image {
    productImageId: number;
    imagePath: string;
    isMain: boolean;
    
  }
  
  export interface Variant {
    variantId: number;
    sizeId: number;
    colorId: number;
    price: number;
    imagePath: string;
    sku: string;
  }
  
  export interface ProductDetailResponse {
    data: {
      product: Product;
      variantIds: number[];
      variants: Variant[];
    };
    status: boolean;
    message: string;
  }