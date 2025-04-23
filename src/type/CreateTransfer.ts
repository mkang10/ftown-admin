// Transfer detail dùng để tạo chi tiết cho đơn transfer
export interface TransferDetail {
    variantId: number;
    quantity: number;
    costPrice: number;
  }
  
  // Payload khi tạo Transfer
  export interface TransferCreateRequest {
    createdBy: number;
    sourceWarehouseId: number;
    destinationWarehouseId: number;
    transferDetails: TransferDetail[];
  }
  
  // Phản hồi API khi tạo Transfer
  export interface TransferCreateResponse {
    status: boolean;
    message: string;
    data?: {
      transferOrderId: number;
      // Các thông tin khác nếu cần
    };
  }
  