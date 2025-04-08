export interface TransferItem {
    transferOrderId: number;
    importId: number;
    dispatchId: number;
    createdBy: number;
    createdDate: string; // ISO 8601 date string, format sẽ là "2025-04-07T19:45:42.09"
    status: string;
    remarks: string | null;
    originalTransferOrderId: number | null;
  }
  export interface TransferResponse {
    status: boolean;
    message: string;
    data: {
      data: TransferItem[];
      totalRecords: number;
      page: number;
      pageSize: number;
    };
  }
  