
import { TransferResponse } from "@/type/transfer";
import adminclient from "./adminclient";
import { TransferCreateRequest, TransferCreateResponse } from "@/type/CreateTransfer";

export const filterTransfers = async (
  filterData: Record<string, any>
): Promise<TransferResponse> => {
  try {
    // Tạo query string từ filterData: thêm key nếu có giá trị khác null/undefined
    const queryParams = new URLSearchParams();
    Object.keys(filterData).forEach((key) => {
      if (filterData[key] !== undefined && filterData[key] !== null && filterData[key] !== "") {
        queryParams.append(key, filterData[key]);
      }
    });

    // Gọi API với endpoint /transfer và query string được tạo
    const response = await adminclient.get<TransferResponse>(
      `/transfer?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching transfers:", error);
    throw error;
  }
};


export const createTransfer = async (
  data: TransferCreateRequest
): Promise<TransferCreateResponse> => {
  try {
    const response = await adminclient.post<TransferCreateResponse>(
      "/transfer/create-transfer-fullflow",
      data
    );
    // Nếu response.data.status trả về false, ném lỗi với message từ API
    if (!response.data.status) {
      throw new Error(response.data.message);
    }
    return response.data;
  } catch (error) {
    console.error("Error creating transfer:", error);
    throw error;
  }
};
