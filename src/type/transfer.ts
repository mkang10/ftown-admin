export interface TransferOrderItem {
  transferOrderId: number;
  importId: number;
  importReferenceNumber: string;
  dispatchId: number;
  dispatchReferenceNumber: string;
  createdBy: number;
  createdDate: string; // định dạng ISO: "2025-04-07T19:45:42.09"
  status: string;
  remarks: string | null;
  createdByName: string;
  originalTransferOrderId: number | null;
}

export interface TransferResponse {
  status: boolean;
  message: string;
  data: {
    data: TransferOrderItem[];
    totalRecords: number;
    page: number;
    pageSize: number;
  };
}

// Nếu có trường filter dữ liệu đơn giản, bạn có thể định nghĩa kiểu FilterData
export interface TransferFilterData {
  page?: number;
  pageSize?: number;
  filter?: string;
  // Nếu API hỗ trợ thêm các thông số sắp xếp thì có thể thêm:
  // sortField?: string;
  // isDescending?: boolean;
}
