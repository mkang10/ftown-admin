import { TransferResponse } from "@/type/transfer";
import adminclient from "./adminclient";

export const filterTransfers = async (
    filterData: Record<string, any>
  ): Promise<TransferResponse> => {
    try {
      // Tạo query string từ filterData: duyệt qua các key và chỉ thêm key có giá trị hợp lệ
      const queryParams = new URLSearchParams();
      Object.keys(filterData).forEach((key) => {
        if (filterData[key]) {
          queryParams.append(key, filterData[key]);
        }
      });
  
      // Gọi GET với query string, ví dụ endpoint: /transfer?page=1&pageSize=10&filter=...
      const response = await adminclient.get<TransferResponse>(
        `/transfer?${queryParams.toString()}`
      );
      return response.data;
    } catch (error) {
      console.error("Error filtering transfers:", error);
      throw error;
    }
  };
  