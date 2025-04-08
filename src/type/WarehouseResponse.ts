export interface WarehouseStock {
    wareHouseStockId: number;
    variantId: string;
    stockQuantity: number;
    wareHouseId : number;
    warehouseName : string;
    fullProductName : string
    // Thêm các field khác nếu có
  }
  
  export interface WarehouseStockResponse {
    data: {
      data: WarehouseStock[];
      totalRecords: number;
      page: number;
      pageSize: number;
    };
    status: boolean;
    message: string;
  }
  