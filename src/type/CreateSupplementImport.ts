export interface InventoryCreateSupplementRequest {
    originalImportId: number;
    importDetails: {
      productVariantId: number;
      unitPrice: number;
    }[];
  }
  
  export interface InventoryCreateSupplementResponse {
    data: any;
    status: boolean;
    message: string;
  }