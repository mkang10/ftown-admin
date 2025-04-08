// utils.ts
export interface StoreAllocation {
    storeId: number;
    allocatedQuantity: number;
    status: string;
    comments: string;
    staffDetailId: number;
  }
  
  export const mapStoreDetailsToAllocations = (
    storeDetails: { wareHouseId: number; allocatedQuantity: number }[]
  ): StoreAllocation[] => {
    return storeDetails.map((store) => ({
      storeId: store.wareHouseId, // chuyển wareHouseId thành storeId
      allocatedQuantity: store.allocatedQuantity,
      status: "", // giá trị mặc định, bạn có thể thay đổi theo yêu cầu
      comments: "",
      staffDetailId: 0,
    }));
  };
  