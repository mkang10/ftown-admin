import { ProductResponse } from "@/type/ProductList";
import adminClient from "./adminclient";
import apiclient from "./apiclient";
import { CreateProductRequest, CreateProductResponse } from "@/type/CreateProduct";
import { ProductDetailResponse } from "@/type/ProductDetail";
import { UpdateProductRequest, UpdateProductResponse } from "@/type/UpdateProductResponse";

export const fetchProducts = async (
    params: Record<string, any>
  ): Promise<ProductResponse> => {
    const response = await adminClient.get<ProductResponse>('/products', { params });
    return response.data;
  };

  export const createProduct = async (payload: CreateProductRequest): Promise<CreateProductResponse> => {
    const formData = new FormData();
    formData.append('name', payload.name);
    formData.append('description', payload.description);
    formData.append('categoryId', payload.categoryId.toString());
    formData.append('origin', payload.origin);
    formData.append('model', payload.model);
    formData.append('occasion', payload.occasion);
    formData.append('style', payload.style);
    formData.append('material', payload.material);
    formData.append('status', payload.status);
    payload.images.forEach(file => {
      formData.append('images', file);
    });
  
    const response = await adminClient.post<CreateProductResponse>('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  };

  export const fetchProductDetail = async (
    id: number
  ): Promise<ProductDetailResponse> => {
    try {
      const response = await adminClient.get<ProductDetailResponse>(`/products/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching product detail for id=${id}:`, error);
      throw error;
    }
  };
  

  export const updateProduct = async (
    id: number,
    payload: UpdateProductRequest
  ): Promise<UpdateProductResponse> => {
    const form = new FormData();
  
    form.append('Name', payload.Name);
    form.append('Description', payload.Description);
    if (payload.CategoryId !== undefined) form.append('CategoryId', String(payload.CategoryId));
    if (payload.Origin) form.append('Origin', payload.Origin);
    if (payload.Model) form.append('Model', payload.Model);
    if (payload.Occasion) form.append('Occasion', payload.Occasion);
    if (payload.Style) form.append('Style', payload.Style);
    if (payload.Material) form.append('Material', payload.Material);
    if (payload.Status) form.append('Status', payload.Status);
  
    // Gửi ExistingImages dạng: ExistingImages[0].ProductImageId, ExistingImages[0].IsMain, ExistingImages[0].ImageFile
    payload.ExistingImages.forEach((img, idx) => {
      form.append(`ExistingImages[${idx}].ProductImageId`, String(img.productImageId));
      form.append(`ExistingImages[${idx}].IsMain`, String(img.isMain));
      if ((img as any).imageFile) {
        form.append(`ExistingImages[${idx}].ImageFile`, (img as any).imageFile); // Cast nếu type không chứa imageFile
      }
    });
  
    // Gửi NewImages dạng: NewImages[0].ImageFile, NewImages[0].IsMain
    payload.NewImages.forEach((img, idx) => {
      form.append(`NewImages[${idx}].ImageFile`, img.imageFile);
      form.append(`NewImages[${idx}].IsMain`, String(img.isMain));
    });
  
    try {
      const response = await adminClient.put<UpdateProductResponse>(
        `/products/${id}`,
        form,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      );
      return response.data;
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };
  

  