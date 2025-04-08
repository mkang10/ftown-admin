// /src/api/inventoryImportApi.ts
import { ApproveRejectPayload, ApproveRejectResponse, FilterInventoryResponse, InventoryImportItem, PendingInventoryResponse } from "@/type/InventoryImport";
import adminclient from "./adminclient";
import { ImportDetailResponse } from "@/type/importdetail";
import { productVariant } from "@/type/Product";
import { InventoryImportCreateRequest, InventoryImportCreateResponse } from "@/type/CreateInventoryImport";
import shopmanagerclient from "./ShopmanagerClient";
import { Warehouse } from "@/type/warehouse";
import { InventoryCreateSupplementRequest, InventoryCreateSupplementResponse } from "@/type/CreateSupplementImport";


export const getPendingInventoryImports = async (): Promise<PendingInventoryResponse> => {
  try {
    const response = await adminclient.get<PendingInventoryResponse>("/inventoryimport/pending");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending inventory imports:", error);
    throw error;
  }
};

export const createInventoryImport = async (
  data: InventoryImportCreateRequest
): Promise<InventoryImportCreateResponse> => {
  try {
    const response = await adminclient.post<InventoryImportCreateResponse>(
      "/inventoryimport/create",
      data
    );
    return response.data;
  } catch (error) {
    console.error("Error creating inventory import:", error);
    throw error;
  }
};

export const getProductVariants = async (
  page: number = 1,
  pageSize: number = 5
): Promise<{ data: productVariant[]; totalRecords: number }> => {

  try {
    const response = await shopmanagerclient.get<{
      data: {
        data: productVariant[];
        totalRecords: number;
        page: number;
        pageSize: number;
      };
      status: boolean;
      message: string;
    }>(`/inventoryimport/product?page=${page}&pageSize=${pageSize}`);
    if (response.data.status) {
      return {
        data: response.data.data.data,
        totalRecords: response.data.data.totalRecords,
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching product variants:", error);
    throw error;
  }
};
export const approveInventoryImport = async (
  importId: number,
  payload: ApproveRejectPayload
): Promise<ApproveRejectResponse> => {
  try {
    const response = await adminclient.post<ApproveRejectResponse>(`/inventoryimport/${importId}/approve`, payload);
    return response.data;
  } catch (error) {
    console.error("Error approving inventory import:", error);
    throw error;
  }
};

// Hàm reject inventory import
export const rejectInventoryImport = async (
  importId: number,
  payload: ApproveRejectPayload
): Promise<ApproveRejectResponse> => {
  try {
    const response = await adminclient.post<ApproveRejectResponse>(`/inventoryimport/${importId}/reject`, payload);
    return response.data;
  } catch (error) {
    console.error("Error rejecting inventory import:", error);
    throw error;
  }
};

export const getWarehouses = async (
  page: number = 1,
  pageSize: number = 5
): Promise<{ data: Warehouse[]; totalRecords: number }> => {

  try {
    const response = await adminclient.get<{
      data: {
        data: Warehouse[];
        totalRecords: number;
        page: number;
        pageSize: number;
      };
      status: boolean;
      message: string;
    }>(`/inventoryimport/warehouse?page=${page}&pageSize=${pageSize}`);
    if (response.data.status) {
      return {
        data: response.data.data.data,
        totalRecords: response.data.data.totalRecords,
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching product variants:", error);
    throw error;
  }
};

// Hàm filter inventory imports theo các trường filter (truyền vào dưới dạng FormData)
export const filterInventoryImports = async (
  filterData: Record<string, any>
): Promise<FilterInventoryResponse> => {
  try {
    // Tạo query string từ filterData
    const queryParams = new URLSearchParams();
    Object.keys(filterData).forEach((key) => {
      if (filterData[key]) {
        queryParams.append(key, filterData[key]);
      }
    });

    // Gọi GET với query string
    const response = await adminclient.get<FilterInventoryResponse>(
      `/inventoryimport/filter?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error filtering inventory imports:", error);
    throw error;
  }
};

export const getImportDetail = async (importId: number): Promise<ImportDetailResponse> => {
  try {
    // Gửi GET request với importId được đính kèm trong URL
    const response = await adminclient.get<ImportDetailResponse>(`/inventoryimport/${importId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching import detail:", error);
    throw error;
  }
};

export const createSupplementInventoryImport = async (
  data: InventoryCreateSupplementRequest
): Promise<InventoryCreateSupplementResponse> => {
  try {
    const response = await adminclient.post<InventoryImportCreateResponse>(
      "/inventoryimport/create-supplement",
      data
    );
    // Nếu response.status trả về false, ném lỗi với message từ API
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    console.error("Error creating inventory import:", error);
    throw error;
  }
};