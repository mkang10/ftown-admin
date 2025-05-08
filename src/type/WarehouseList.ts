export interface Warehouse {
    warehouseId: number;
    warehouseName: string;
    warehouseDescription: string;
    location: string;
    createdDate: string;
    imagePath: string | null;
    email: string;
    phone: string;
    warehouseType: string;
    shopManagerId: number;
    safetyStock : number;
    urgentSafetyStock : number;
  }
  
  export interface WarehouseStock {
    wareHouseStockId: number;
    variantId: number;
    productName: string;
    variantName: string;
    sizeName: string;
    colorName: string;
    stockQuantity: number;
    wareHouseId: number;
    wareHouseName: string;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    totalRecords: number;
    page: number;
    pageSize: number;
  }
  
  export interface ApiResponse<T> {
    data: T;
    status: boolean;
    message: string;
  }