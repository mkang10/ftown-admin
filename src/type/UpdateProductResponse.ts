export interface UpdateProductRequest {
    Name: string;
    Description: string;
    CategoryId?: number;
    Origin?: string;
    Model?: string;
    Occasion?: string;
    Style?: string;
    Material?: string;
    Status?: string;
    ExistingImages: Array<{
      productImageId: number;
      isMain: boolean;
      imageFile?: File; // optional field nếu user muốn đổi ảnh
    }>;
    NewImages: Array<{
      imageFile: File;
      isMain: boolean;
    }>;
  }
  
  

  export interface UpdateProductResponse {
    data: string;
    status: boolean;
    message: string;
  }
  