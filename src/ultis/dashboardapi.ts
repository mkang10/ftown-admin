import { DashboardResponse } from "@/type/dashboard";
import adminClient from "./adminclient";

export const getDashboard = async (
  status?: string
): Promise<DashboardResponse> => {
  try {
    const response = await adminClient.get<DashboardResponse>(
      "/dashboard",
      {
        params: status ? { status } : {},
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching dashboard:", error);
    throw error;
  }
};