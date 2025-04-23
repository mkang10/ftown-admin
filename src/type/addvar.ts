export interface ColorOption {
    colorId: number;
    colorName: string;
    colorCode: string;
  }
  
  export interface SizeOption {
    sizeId: number;
    sizeName: string;
    sizeDescription: string;
}

export interface ApiResponse<T> {
    data: T;
    status: boolean;
    message: string;
  }