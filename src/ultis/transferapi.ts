
import { TransferResponse } from "@/type/transfer";
import adminclient from "./adminclient";
import { TransferCreateRequest, TransferCreateResponse } from "@/type/CreateTransfer";
import { TransferResponseDto } from "@/type/transferdetail";
import { ApiResponse } from "@/type/apiResponse";

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
): Promise<void> => {
  try {
    // Gửi request và luôn resolve để client tự xử lý status
    const response = await adminclient.post(
      "/transfer/create-transfer-fullflow",
      data,
      {
        responseType: "blob", // Nhận về blob (file hoặc JSON lỗi)
        validateStatus: () => true,
      }
    );

    // Lấy content-type từ header
    const contentType = response.headers["content-type"] || "";

    // Nếu server trả về JSON (thường là lỗi)
    if (contentType.includes("application/json")) {
      // Blob hỗ trợ .text() trong trình duyệt hiện đại
      const text = await response.data.text();
      const json = JSON.parse(text) as ApiResponse<any>;

      if (!json.status) {
        // Ném Error với message chi tiết từ server
        throw new Error(json.message);
      }

      // Trường hợp JSON thành công (nếu có) thì thoát
      return;
    }

    // Ngược lại, server trả về file -> tiến hành download
    let fileName = "downloaded_file";
    const disposition = response.headers["content-disposition"];
    if (disposition && disposition.includes("filename=")) {
      const filenameRegex = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/;
      const matches = filenameRegex.exec(disposition);
      if (matches && matches[1]) {
        fileName = matches[1].replace(/['"]/g, "");
      }
    }

    // Tạo URL từ blob và trigger download
    const blob = response.data;
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    // Xử lý lỗi: ưu tiên message từ server, fallback thông báo chung
    console.error("Error creating transfer:", error);
    const msg = error?.message || "Đã xảy ra lỗi khi tạo phiếu chuyển";
    throw new Error(msg);
  }
};


/** Lấy chi tiết Transfer theo transferOrderId */
export const getTransferById = async (
  id: number
): Promise<TransferResponseDto> => {
  try {
    const response = await adminclient.get<{ data: TransferResponseDto }>(
      `/transfer/transfer/${id}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching transfer by id:", error);
    throw error;
  }
};
