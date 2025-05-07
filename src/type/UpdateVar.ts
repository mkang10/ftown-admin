export interface UpdateVariantRequest {
    variantId: number;
    price: number;
    status: string;
    imageFile?: File;
    maxStocks : number;
  }
  
  // Response từ API cập nhật
  export interface UpdateVariantResponse {
    data: {
      variantId: number;
      price: number;
      status: string;
      imageFile: {
        contentType: string;
        fileName: string;
        length: number;
      };
    };
    status: boolean;
    message: string;
  }
  