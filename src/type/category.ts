export interface Category {
    categoryId: number;
    name: string;
    description: string;
    parentCategoryId: number | null;
    isActive: boolean;
    displayOrder: number;
    products: any[];
  }
  
  /**
   * Response chung
   */
  export interface ApiResponse<T> {
    data: T;
    status: boolean;
    message: string;
  }