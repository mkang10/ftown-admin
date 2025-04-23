import adminclient from "@/ultis/adminclient";
import shopmanagerclient from "./ShopmanagerClient";
import { PaginatedResponse, Warehouse, WarehouseStock } from "@/type/WarehouseList";
import { ApiResponse } from "@/type/apiResponse";
import { WarehouseStockDetailResponse } from "@/type/warehousestockdetail";



export const fetchWarehouses = async (
  page: number,
  pageSize: number,
  search: string
): Promise<PaginatedResponse<Warehouse>> => {
  const resp = await adminclient.get<ApiResponse<PaginatedResponse<Warehouse>>>(
    `/inventoryimport/warehouse?page=${page}&pageSize=${pageSize}${
      search ? `&search=${encodeURIComponent(search)}` : ''
    }`
  );
  if (!resp.data.status) throw new Error(resp.data.message);
  return resp.data.data;
};

export const fetchWarehouseStock = async (
  warehouseId: number,
  params: {
    productName?: string;
    sizeName?: string;
    colorName?: string;
    stockQuantity?: number;
    page?: number;
    pageSize?: number;
  }
): Promise<PaginatedResponse<WarehouseStock>> => {
  const query = new URLSearchParams();
  if (params.productName) query.append('productName', params.productName);
  if (params.sizeName) query.append('sizeName', params.sizeName);
  if (params.colorName) query.append('colorName', params.colorName);
  if (params.stockQuantity != null) query.append('stockQuantity', String(params.stockQuantity));
  query.append('page', String(params.page ?? 1));
  query.append('pageSize', String(params.pageSize ?? 10));

  // Directly return the API response which already matches PaginatedResponse<WarehouseStock>
  const resp = await adminclient.get<PaginatedResponse<WarehouseStock>>(  
    `/warehousestock/warehouse/${warehouseId}?${query.toString()}`
  );
  return resp.data;
};

export const createWarehouse = async (formData: FormData): Promise<number> => {
  const resp = await adminclient.post<ApiResponse<number>>(
    `/warehousestock`,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  if (!resp.data.status) throw new Error(resp.data.message);
  return resp.data.data;
};

export const fetchWarehouseStockDetail = async (
  id: number
): Promise<WarehouseStockDetailResponse> => {
  try {
    const response = await adminclient.get<WarehouseStockDetailResponse>(
      `/warehousestock/${id}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching warehouse stock detail (id=${id}):`, error);
    throw error;
  }
};
