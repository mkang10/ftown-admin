import adminclient from "@/ultis/adminclient";
import { WarehouseStockResponse } from "@/type/WarehouseResponse";

export const getWarehouseStocks = async (
  page: number = 1,
  pageSize: number = 10
): Promise<WarehouseStockResponse> => {
  try {
    // Gửi GET request với page và pageSize được đính kèm trong URL
    const response = await adminclient.get<WarehouseStockResponse>(
      `https://localhost:7265/api/warehousestock?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching warehouse stocks:", error);
    throw error;
  }
};
