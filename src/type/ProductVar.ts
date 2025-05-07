export interface ProductDetailData {
    variantId: number;
    productName: string;
    sizeName: string;
    colorName: string;
    price: number;
    imagePath: string;
    sku: string;
    barcode?: string | null;
    weight?: number | null;
    status?: string
    maxStock : number;
  }
  
  export interface ProductDetailResponse {
    data: ProductDetailData;
    status: boolean;
    message: string;
  }