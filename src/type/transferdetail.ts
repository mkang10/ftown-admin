export interface TransferResponseDto {
    jsonTransfer: JsonTransfer;
    jsonDispatch: JsonDispatch | null;
    jsonImport: JsonImport;
    auditLogs: AuditLog[];
  }
  
  /**
   * Thông tin chuyển hàng chính
   */
  export interface JsonTransfer {
    transferOrderId: number;
    importId: number;
    dispatchId: number;
    createdBy: number | null;
    createdDate: string; // ISO datetime
    status: string;
    remarks: string | null;
    originalTransferOrderId: number | null;
    detailsTransferOrder: TransferOrderDetail[];
  }
  
  /**
   * Chi tiết từng mục trong đơn chuyển hàng
   */
  export interface TransferOrderDetail {
    transferOrderDetailId: number;
    transferOrderId: number;
    sourceStoreId: number;
    product: any | null;
    quantity: number;
    deliveredQuantity: number | null;
  }
  
  /**
   * Thông tin dispatch (có thể null nếu chưa dispatch)
   */
  export type JsonDispatch = any; // TODO: Định nghĩa chi tiết nếu cần
  
  /**
   * Thông tin import hàng
   */
  export interface JsonImport {
    importId: number;
    createdBy: number | null;
    createdDate: string; // ISO datetime
    status: string;
    referenceNumber: string;
    totalCost: number;
    approvedDate: string | null;
    completedDate: string;
    originalImportId: number | null;
    details: ImportDetail[];
  }
  
  /**
   * Chi tiết từng mục import
   */
  export interface ImportDetail {
    importDetailId: number;
    importId: number;
    productVariantName: string | null;
    quantity: number;
    costPrice: number | null;
    priceProductVariant: number;
    storeImportDetail: StoreImportDetail[];
  }
  
  /**
   * Chi tiết lưu kho khi import
   */
  export interface StoreImportDetail {
    actualReceivedQuantity: number;
    allocatedQuantity: number;
    status: string;
    comments: string;
    staff: any | null;
    importDetailId: number;
    importStoreId: number;
    warehouseName: string | null;
    handleBy: any | null;
  }
  
  /**
   * Log thao tác audit
   */
  export interface AuditLog {
    auditLogId: number;
    tableName: string;
    recordId: string;
    operation: string;
    changeDate: string; // ISO datetime
    changedBy: number;
    changeData: string;
    comment: string;
  }
  