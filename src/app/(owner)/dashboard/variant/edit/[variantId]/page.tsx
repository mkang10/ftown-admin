"use client";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import {
  TextField,
  Button,
  CircularProgress,
  Typography,
  Card,
  CardContent,
  Stack,
  Box,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { getProductVariantDetail, updateProductVariant } from "@/ultis/Productvar";
import { ProductDetailData } from "@/type/ProductVar";
import { UpdateVariantRequest } from "@/type/UpdateVar";

const EditVariantPage: React.FC = () => {
  const router = useRouter();
  const params = useParams() as { variantId?: string };
  const variantId = params.variantId ? parseInt(params.variantId, 10) : NaN;

  const [initial, setInitial] = useState<ProductDetailData | null>(null);
  const [price, setPrice] = useState<number>(0);
  const [status, setStatus] = useState<string>("Published");
  const [maxStocks, setMaxStocks] = useState<number>(1);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [openImageDialog, setOpenImageDialog] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string>("");

  // Fetch initial data
  useEffect(() => {
    if (isNaN(variantId)) {
      toast.error("ID biến thể không hợp lệ");
      setLoading(false);
      return;
    }

    getProductVariantDetail(variantId)
      .then((res) => {
        if (res.status) {
          setInitial(res.data);
          setPrice(res.data.price);
          setStatus(res.data.status ?? "Published");
          setMaxStocks(res.data.maxStock ?? 1);
        } else {
          toast.error(res.message);
        }
      })
      .catch(() => {
        toast.error("Lỗi khi lấy dữ liệu biến thể");
      })
      .finally(() => setLoading(false));
  }, [variantId]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isNaN(variantId)) return;
    if (maxStocks <= 0) {
      toast.error("Tồn kho tối đa phải lớn hơn 0");
      return;
    }
    setSubmitting(true);

    try {
      const payload: UpdateVariantRequest = {
        variantId,
        price,
        status,
        maxStocks,
        imageFile,
      };

      const res = await updateProductVariant(payload);
      if (res.status) {
        toast.success("Cập nhật thành công!");
        router.back();
      } else {
        toast.error(res.message);
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Lỗi khi cập nhật biến thể");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress sx={{ color: "#111" }} />
      </Box>
    );
  }

  if (!initial) {
    return (
      <Typography align="center" mt={4}>
        Không tìm thấy dữ liệu biến thể
      </Typography>
    );
  }

  const selectedImageUrl = imageFile
    ? URL.createObjectURL(imageFile)
    : initial.imagePath;

  const handleImageClick = () => {
    setImageUrl(selectedImageUrl);
    setOpenImageDialog(true);
  };

  const handleDialogClose = () => setOpenImageDialog(false);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "#f5f5f5",
      }}
    >
      <Card
        sx={{
          maxWidth: 600,
          width: "100%",
          p: 3,
          bgcolor: "#fff",
          boxShadow: 5,
          borderRadius: 4,
        }}
      >
        <CardContent>
          <Typography
            variant="h5"
            fontWeight="600"
            gutterBottom
            sx={{ color: "#111" }}
          >
            Chỉnh sửa Biến Thể #{variantId}
          </Typography>

          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <Stack spacing={3}>
              <TextField
                label="Giá (VNĐ)"
                type="number"
                value={price}
                onChange={(e) => setPrice(parseFloat(e.target.value) || 0)}
                required
                fullWidth
                sx={{
                  input: { color: "#111" },
                  label: { color: "#111", fontWeight: 500 },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#111" },
                    "&.Mui-focused fieldset": { borderColor: "#111" },
                  },
                }}
              />

              <TextField
                select
                label="Trạng thái"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                fullWidth
                sx={{
                  input: { color: "#111" },
                  label: { color: "#111", fontWeight: 500 },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#111" },
                    "&.Mui-focused fieldset": { borderColor: "#111" },
                  },
                }}
              >
                <MenuItem value="Published">Published</MenuItem>
                <MenuItem value="Draft">Draft</MenuItem>
              </TextField>

              <TextField
                label="Tồn kho tối đa"
                type="number"
                inputProps={{ min: 1 }}
                value={maxStocks}
                onChange={(e) =>
                  setMaxStocks(Math.max(1, parseInt(e.target.value) || 0))
                }
                error={maxStocks <= 0}
                helperText={
                  maxStocks <= 0 ? "Tồn kho tối đa phải lớn hơn 0" : ""
                }
                required
                fullWidth
                sx={{
                  input: { color: "#111" },
                  label: { color: "#111", fontWeight: 500 },
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": { borderColor: "#ccc" },
                    "&:hover fieldset": { borderColor: "#111" },
                    "&.Mui-focused fieldset": { borderColor: "#111" },
                  },
                }}
              />

              <Button
                variant="outlined"
                component="label"
                sx={{
                  borderColor: "#111",
                  color: "#111",
                  "&:hover": { borderColor: "#333", color: "#333" },
                  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                }}
              >
                Chọn ảnh mới
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </Button>

              {(imageFile || initial.imagePath) && (
                <Box mt={2} onClick={handleImageClick} sx={{ cursor: "pointer" }}>
                  <Typography variant="body2" color="textSecondary">
                    {imageFile ? `Đã chọn: ${imageFile.name}` : "Ảnh hiện tại"}
                  </Typography>
                  <Box
                    sx={{
                      mt: 1,
                      width: "100%",
                      height: 250,
                      backgroundImage: `url(${selectedImageUrl})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      borderRadius: 2,
                      border: "2px solid #ddd",
                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                </Box>
              )}

              <Stack direction="row" spacing={3} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => router.back()}
                  disabled={submitting}
                  sx={{
                    borderColor: "#111",
                    color: "#111",
                    "&:hover": { borderColor: "#333", color: "#333" },
                  }}
                >
                  Hủy
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={submitting}
                  sx={{
                    backgroundColor: "#111",
                    color: "white",
                    "&:hover": { backgroundColor: "#333" },
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.2)",
                  }}
                >
                  {submitting ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
              </Stack>
            </Stack>
          </form>
        </CardContent>
      </Card>

      {/* Image Preview Dialog */}
      <Dialog open={openImageDialog} onClose={handleDialogClose}>
        <DialogTitle>Ảnh xem trước</DialogTitle>
        <DialogContent>
          <Box
            sx={{
              width: "100%",
              height: 400,
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: "contain",
              backgroundPosition: "center",
              borderRadius: 2,
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
      <Toaster position="top-center" reverseOrder={false} />

    </Box>
    
  );
};

export default EditVariantPage;
