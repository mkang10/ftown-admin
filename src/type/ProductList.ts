
export interface Product {
    productId: number;
    name: string;
    description: string;
    categoryName: string;
    model: string;
    status: string;
    imagePath: string | null;
  }
  
  export interface ProductResponse {
    data: Product[];
    totalRecords: number;
  }