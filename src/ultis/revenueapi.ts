import { RevenueSummaryRequest, RevenueSummaryResponse } from "@/type/revenue";
import orderclient from "./orderclient";

/**
 * GET: Lấy thống kê doanh thu theo khoảng thời gian
 * @param params.from Thời gian bắt đầu (ISO 8601)
 * @param params.to Thời gian kết thúc (ISO 8601)
 */
export const getRevenueSummary = async (
  params: RevenueSummaryRequest
): Promise<RevenueSummaryResponse> => {
  try {
    const response = await orderclient.get<RevenueSummaryResponse>(
      "/revenue/summary",
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching revenue summary:", error);
    throw error;
  }
};