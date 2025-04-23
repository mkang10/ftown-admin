import { DispatchResponse } from "@/type/dispatch";
import shopmanagerclient from "./ShopmanagerClient";
import { DispatchResponseDto } from "@/type/dispatchdetail";
import adminClient from "./adminclient";



export const getDispatches = async (
  page: number,
  pageSize: number,
  filters?: Record<string, any>
): Promise<DispatchResponse> => {
  const queryParams = new URLSearchParams();

  queryParams.append("page", page.toString());
  queryParams.append("pageSize", pageSize.toString());

  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        queryParams.append(key, value);
      }
    });
  }

  const response = await shopmanagerclient.get<{
    data: DispatchResponse;
    status: boolean;
    message: string;
  }>(`/dispatch/get-all?${queryParams.toString()}`);

  return response.data.data;
};


export const getDispatchById = async (
  id: number
): Promise<DispatchResponseDto> => {
  const response = await adminClient.get<{ data: DispatchResponseDto }>(
    `/dispatch/dispatch/${id}`
  );
  return response.data.data;
};