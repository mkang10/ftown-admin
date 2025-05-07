import { ProductDetailResponse } from "@/type/ProductVar";
import adminClient from "./adminclient";
import { UpdateVariantRequest, UpdateVariantResponse } from "@/type/UpdateVar";
import { ApiResponse, ColorOption, SizeOption } from "@/type/addvar";

export const getProductVariantDetail = async (
    variantId: number
  ): Promise<ProductDetailResponse> => {
    try {
      const response = await adminClient.get<ProductDetailResponse>(
        "/products/variant-detail",
        { params: { variantId } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching product variant detail:", error);
      throw error;
    }
  };


export const updateProductVariant = async (
  payload: UpdateVariantRequest
): Promise<UpdateVariantResponse> => {
  const formData = new FormData();

  // Append các trường bắt buộc
  formData.append("VariantId", payload.variantId.toString());
  formData.append("Price", payload.price.toString());
  formData.append("Status", payload.status);
  formData.append("MaxStocks", payload.maxStocks.toString());

  // Append file nếu có
  if (payload.imageFile) {
    formData.append("ImageFile", payload.imageFile, payload.imageFile.name);
  }

  try {
    const response = await adminClient.put<UpdateVariantResponse>(
      "/products",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Lỗi khi cập nhật biến thể:", error);
    throw error;
  }
};

  

  export const getColors = async (): Promise<ApiResponse<ColorOption[]>> => {
    try {
      const response = await adminClient.get<ApiResponse<ColorOption[]>>("/products/color");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy màu:", error);
      throw error;
    }
  };
  
  // Lấy danh sách kích thước
  export const getSizes = async (): Promise<ApiResponse<SizeOption[]>> => {
    try {
      const response = await adminClient.get<ApiResponse<SizeOption[]>>("/products/size");
      return response.data;
    } catch (error) {
      console.error("Lỗi khi lấy kích thước:", error);
      throw error;
    }
  };
  
  // Tạo biến thể sản phẩm mới
  export const createProductVariant = async (formData: FormData): Promise<ApiResponse<number>> => {
    try {
      const response = await adminClient.post<ApiResponse<number>>("/products/variant", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      console.error("Lỗi khi tạo biến thể:", error);
      throw error;
    }
  };