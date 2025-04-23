export interface InventoryCreateSupplementRequest {
    originalImportId: number;
    importDetails: {
      productVariantId: number;
      costPrice: number;
    }[];
  }
  
  export interface InventoryCreateSupplementResponse {
    data: any;
    status: boolean;
    message: string;
  }