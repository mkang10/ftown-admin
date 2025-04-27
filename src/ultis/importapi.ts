// /src/api/inventoryImportApi.ts
import { ApproveRejectPayload, ApproveRejectResponse, FilterInventoryResponse, InventoryImportItem, PendingInventoryResponse } from "@/type/InventoryImport";
import adminclient from "./adminclient";
import { ImportDetailResponse } from "@/type/importdetail";
import { productVariant } from "@/type/Product";
import { InventoryImportCreateRequest, InventoryImportCreateResponse } from "@/type/CreateInventoryImport";
import shopmanagerclient from "./ShopmanagerClient";
import { Warehouse } from "@/type/warehouse";
import { InventoryCreateSupplementRequest, InventoryCreateSupplementResponse } from "@/type/CreateSupplementImport";


export const getPendingInventoryImports = async (): Promise<PendingInventoryResponse> => {
  try {
    const response = await adminclient.get<PendingInventoryResponse>("/inventoryimport/pending");
    return response.data;
  } catch (error) {
    console.error("Error fetching pending inventory imports:", error);
    throw error;
  }
};


export const getProductVariants = async (
  page: number = 1,
  pageSize: number = 5,
  search: string = ""
): Promise<{ data: productVariant[]; totalRecords: number }> => {
  try {
    const response = await shopmanagerclient.get<{
      data: {
        data: productVariant[];
        totalRecords: number;
        page: number;
        pageSize: number;
      };
      status: boolean;
      message: string;
    }>(
      `/inventoryimport/product`, 
      {
        params: { page, pageSize, search }
      }
    );
    if (response.data.status) {
      return {
        data: response.data.data.data,
        totalRecords: response.data.data.totalRecords,
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching product variants:", error);
    throw error;
  }
};
export const approveInventoryImport = async (
  importId: number,
  payload: ApproveRejectPayload
): Promise<ApproveRejectResponse> => {
  try {
    // Gọi API với responseType 'blob' để nhận file .docx
    const resp = await adminclient.post(
      `/inventoryimport/${importId}/approve`,
      payload,
      { responseType: 'blob' }
    );

    // Kiểm tra xem server có trả về JSON lỗi không
    const contentType = resp.headers['content-type'] || '';
    if (contentType.includes('application/json')) {
      // nếu là JSON lỗi, parse blob rồi ném lỗi
      const txt = await resp.data.text();
      const err = JSON.parse(txt);
      return Promise.reject(new Error(err.message || 'Error approving import'));
    }

    // Lấy filename từ header Content‑Disposition
    const cd = resp.headers['content-disposition'] || '';
    let filename = `PhieuNhap_${importId}.docx`;
    const m = cd.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (m?.[1]) {
      filename = m[1].replace(/['"]/g, '');
    }

    // Tạo URL blob và trigger download
    const blobUrl = window.URL.createObjectURL(new Blob([resp.data]));
    const a = document.createElement('a');
    a.href = blobUrl;
    a.setAttribute('download', filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);

    // Trả về như cũ
    return {
      status: true,
      message: 'Inventory import approved successfully.',
    };
  } catch (error: any) {
    console.error('Error approving inventory import:', error);
    // Nếu server trả blob JSON lỗi, parse tiếp
    if (
      error.response?.data &&
      error.response.headers['content-type']?.includes('application/json')
    ) {
      try {
        const txt = await error.response.data.text();
        const err = JSON.parse(txt);
        return Promise.reject(new Error(err.message || error.message));
      } catch {
        // fallback
      }
    }
    return Promise.reject(error);
  }
};
// Hàm reject inventory import
export const rejectInventoryImport = async (
  importId: number,
  payload: ApproveRejectPayload
): Promise<ApproveRejectResponse> => {
  try {
    const response = await adminclient.post<ApproveRejectResponse>(`/inventoryimport/${importId}/reject`, payload);
    return response.data;
  } catch (error) {
    console.error("Error rejecting inventory import:", error);
    throw error;
  }
};

export const getWarehouses = async (
  page: number = 1,
  pageSize: number = 5
): Promise<{ data: Warehouse[]; totalRecords: number }> => {

  try {
    const response = await adminclient.get<{
      data: {
        data: Warehouse[];
        totalRecords: number;
        page: number;
        pageSize: number;
      };
      status: boolean;
      message: string;
    }>(`/inventoryimport/warehouse?page=${page}&pageSize=${pageSize}`);
    if (response.data.status) {
      return {
        data: response.data.data.data,
        totalRecords: response.data.data.totalRecords,
      };
    } else {
      throw new Error(response.data.message);
    }
  } catch (error) {
    console.error("Error fetching product variants:", error);
    throw error;
  }
};

// Hàm filter inventory imports theo các trường filter (truyền vào dưới dạng FormData)
export const filterInventoryImports = async (
  filterData: Record<string, any>
): Promise<FilterInventoryResponse> => {
  try {
    // Tạo query string từ filterData
    const queryParams = new URLSearchParams();
    Object.keys(filterData).forEach((key) => {
      if (filterData[key]) {
        queryParams.append(key, filterData[key]);
      }
    });

    // Gọi GET với query string
    const response = await adminclient.get<FilterInventoryResponse>(
      `/inventoryimport/filter?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error filtering inventory imports:", error);
    throw error;
  }
};

export const getImportDetail = async (importId: number): Promise<ImportDetailResponse> => {
  try {
    // Gửi GET request với importId được đính kèm trong URL
    const response = await adminclient.get<ImportDetailResponse>(`/inventoryimport/${importId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching import detail:", error);
    throw error;
  }
};

export const createSupplementInventoryImport = async (
  data: InventoryCreateSupplementRequest
): Promise<InventoryCreateSupplementResponse> => {
  try {
    const response = await adminclient.post("/inventoryimport/create-supplement", data, {
      responseType: "blob",
    });

    // Kiểm tra nếu API trả về lỗi theo header hoặc blob không hợp lệ
    // (Cách xử lý này phụ thuộc vào backend – giả sử nếu không thành công, API sẽ trả về blob JSON chứa lỗi)
    // Ở đây, ta giả định rằng nếu thành công, luôn trả file.

    // Lấy tên file từ header
    const contentDisposition = response.headers["content-disposition"];
    let filename = "PhieuNhapSupplement.docx";
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (fileNameMatch && fileNameMatch[1]) {
        filename = fileNameMatch[1].replace(/['"]/g, "");
      }
    }

    // Tạo URL Blob và trigger download
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = blobUrl;
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);

    // Trả về response như cũ
    return {
      status: true,
      message: "Tạo đơn nhập bổ sung thành công và file biên bản đã được tải về.",
      data: null,
    };
  } catch (error) {
    console.error("Error creating inventory supplement import:", error);
    throw error;
  }
};

export const createInventoryImport = async (
  data: InventoryImportCreateRequest
): Promise<InventoryImportCreateResponse> => {
  try {
    const response = await adminclient.post("/inventoryimport/create", data, {
      responseType: "blob",
    });

    // Lấy tên file từ header (nếu có)
    const contentDisposition = response.headers["content-disposition"];
    let filename = "PhieuNhap.docx";
    if (contentDisposition) {
      const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      if (fileNameMatch && fileNameMatch[1]) {
        filename = fileNameMatch[1].replace(/['"]/g, "");
      }
    }

    // Tạo URL Blob và trigger download
    const blobUrl = window.URL.createObjectURL(new Blob([response.data]));
    const a = document.createElement("a");
    a.href = blobUrl;
    a.setAttribute("download", filename);
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(blobUrl);

    // Trả về response như cũ (bạn có thể bổ sung thêm thông tin nếu cần)
    return {
      status: true,
      message: "Tạo import thành công và file biên bản đã được tải về.",
      data: null,
    };
  } catch (error) {
    console.error("Error creating inventory import:", error);
    throw error;
  }
};

export const importInventoryFromExcel = async (
  file: File
): Promise<InventoryImportCreateResponse> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await adminclient.post('/inventoryimport/create-from-excel', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    responseType: 'blob',
  });

  // Lấy tên file từ header nếu có
  const contentDisposition = response.headers['content-disposition'];
  let filename = 'PhieuNhap.docx';
  if (contentDisposition) {
    const match = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
    if (match && match[1]) {
      filename = match[1].replace(/['"]/g, '');
    }
  }

  // Tạo URL blob và trigger download
  const blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = blobUrl;
  a.setAttribute('download', filename);
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(blobUrl);

  return {
    status: true,
    message: 'Tạo import thành công và file biên bản đã được tải về.',
    data: null,
  };
};