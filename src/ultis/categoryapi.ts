import { ApiResponse } from "@/type/apiResponse";
import { Category } from "@/type/category";
import adminClient from "./adminclient";

export const fetchCategories = async (): Promise<ApiResponse<Category[]>> => {
    const response = await adminClient.get<ApiResponse<Category[]>>("/categories");
    return response.data;
  };