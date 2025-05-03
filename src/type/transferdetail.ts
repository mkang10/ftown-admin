export interface TransferResponseDto {
  jsonTransfer: TransferDto;
  jsonImport: ImportDto;
  jsonDispatch: DispatchDto;
  auditLogs: AuditLogDto[];
}

export interface TransferDto {
  transferOrderId: number;
  importId: number;
  dispatchId: number;
  createdBy: string;
  createdDate: string; // ISO string
  status: string;
  remarks: string;
  originalTransferOrderId: number | null;
  detailsTransferOrder: TransferDetailDto[];
}

export interface TransferDetailDto {
  transferOrderDetailId: number;
  transferOrderId: number;
  product: string;
  color: string;
  size: string;
  quantity: number;
  deliveredQuantity: number | null;
}

export interface ImportDto {
  importId: number;
  createdBy: string;
  createdDate: string;
  status: string;
  referenceNumber: string;
  totalCost: number;
  approvedDate: string ;
  completedDate: string | null;
  originalImportId: number | null;
  details: ImportDetailDto[];
}

export interface ImportDetailDto {
  importDetailId: number;
  importId: number;
  product: string;
  size: string;
  color: string;
  quantity: number;
  costPrice: number;
  priceProductVariant: number;
  storeImportDetail: StoreImportDetailDto[];
}

export interface StoreImportDetailDto {
  actualReceivedQuantity: number | null;
  allocatedQuantity: number;
  status: string;
  comments: string;
  staff: string;
  importDetailId: number;
  importStoreId: number;
  warehouseName: string;
  handleBy: string | null;
}

export interface DispatchDto {
  dispatchId: number;
  createdByUser: string;
  createdDate: string;
  status: string;
  referenceNumber: string;
  remarks: string;
  originalId: number;
  completedDate: string | null;
  details: DispatchDetailDto[];
}

export interface DispatchDetailDto {
  dispatchDetailId: number;
  dispatchId: number;
  variantName: string;
  sizeName: string | null;
  colorName: string | null;
  quantity: number;
  priceProductVariant: number;
  storeExportDetail: StoreExportDetailDto[];
}

export interface StoreExportDetailDto {
  warehouseName: string;
  allocatedQuantity: number;
  status: string;
  comments: string;
  staff: string;
  dispatchDetailId: number;
  handleBy: string;
  dispatchStoreDetailId: number;
  actualQuantity: number | null;
}

export interface AuditLogDto {
  auditLogId: number;
  tableName: string;
  recordId: string;
  operation: string;
  changeDate: string;
  changedByName: string;
  comment: string;
}