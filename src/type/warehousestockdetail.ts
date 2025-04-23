
  
  export interface PaginatedResponse<T> {
    data: T[];
    totalRecords: number;
  }
  
  export interface AuditHistoryItem {
    auditId: number;
    action: string;
    quantityChange: number;
    actionDate: string;
    changedBy: number;
    changedByName: string;
    note: string;
  }
  
  export interface WarehouseStockDetail {
    wareHouseStockId: number;
    variantId: number;
    variantName: string;
    stockQuantity: number;
    wareHouseId: number;
    wareHouseName: string;
    auditHistory: AuditHistoryItem[];
  }
  
  export interface WarehouseStockDetailResponse {
    data: WarehouseStockDetail;
    status: boolean;
    message: string;
  }