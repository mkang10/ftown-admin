export interface CreateProductRequest {
    name: string;
    
    description: string;
    categoryId: number;
    origin: string;
    model: string;
    occasion: string;
    style: string;
    material: string;
    status: string;
    images: File[];
  }
  
  export interface CreateProductResponse {
    data: number;
    status: boolean;
    message: string;
  }