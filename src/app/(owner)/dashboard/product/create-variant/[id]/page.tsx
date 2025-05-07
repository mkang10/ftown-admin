"use client";
import React, { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  TextField,
  Button,
  Typography,
  Stack,
  Box,
  MenuItem,
  CircularProgress,
  Divider,
} from "@mui/material";
import { getColors, getSizes, createProductVariant } from "@/ultis/Productvar";
import { Toaster } from "react-hot-toast";
import { toast } from "react-hot-toast";

interface ColorOption {
  colorId: number;
  colorName: string;
  colorCode: string;
}

interface SizeOption {
  sizeId: number;
  sizeName: string;
  sizeDescription: string;
}

const AddVariantPage: React.FC = () => {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const productId = params.id ? parseInt(params.id, 10) : NaN;

  const [sizeId, setSizeId] = useState<number>(0);
  const [colorId, setColorId] = useState<number>(0);
  const [weight, setWeight] = useState<number>(1);
  const [imageFile, setImageFile] = useState<File | undefined>(undefined);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [maxStocks, setMaxStocks] = useState<number>(1);

  const [colors, setColors] = useState<ColorOption[]>([]);
  const [sizes, setSizes] = useState<SizeOption[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getColors(), getSizes()])
      .then(([clrRes, szRes]) => {
        if (clrRes.status) setColors(clrRes.data);
        if (szRes.status) setSizes(szRes.data);
        if (clrRes.data.length) setColorId(clrRes.data[0].colorId);
        if (szRes.data.length) setSizeId(szRes.data[0].sizeId);
      })
      .catch(() => setError("Lỗi khi tải danh sách màu/kích thước"))
      .finally(() => setLoading(false));
  }, []);

  // Tạo preview mỗi lần chọn file mới
  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => {
      URL.revokeObjectURL(url);
    };
  }, [imageFile]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImageFile(file);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isNaN(productId)) return;
    if (weight <= 0) {
      setError("Khối lượng phải lớn hơn 0");
      return;
    }
    if (!imageFile) {
      toast.error("Vui lòng chọn ảnh cho sản phẩm!");
      return;
    }
    setSubmitting(true);
    setError(null);
    const formData = new FormData();
    formData.append("ProductId", productId.toString());
    formData.append("SizeId", sizeId.toString());
    formData.append("ColorId", colorId.toString());
    formData.append("Weight", weight.toString());
    formData.append("MaxStocks", maxStocks.toString());

    formData.append("ImageFile", imageFile, imageFile.name);
    try {
      const res = await createProductVariant(formData);
      if (res.status) {
        toast.success("Tạo biến thể thành công!");
        router.back();
      } else {
        toast.error(res.message || "Tạo thất bại!");
      }
    } catch (err: any) {
      const errorMsg = err.response?.data?.message || err.message || "Đã có lỗi xảy ra!";
      toast.error(errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh" bgcolor="#000">
        <CircularProgress sx={{ color: "#fff" }} />
      </Box>
    );
  }

  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f5f5",
        color: "#111",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"Outfit", sans-serif',
        px: 4,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: "800px",
          bgcolor: "#fff",
          borderRadius: "16px",
          p: 5,
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
        }}
      >
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Typography variant="h4" fontWeight={700} gutterBottom sx={{ fontSize: "2rem" }}>
          Thêm biến thể sản phẩm #{productId}
        </Typography>
        <Divider sx={{ mb: 3 }} />
        <Stack spacing={4} mt={3}>
          <TextField
            select
            label="Kích thước"
            value={sizeId}
            onChange={(e) => setSizeId(parseInt(e.target.value, 10))}
            fullWidth
          >
            {sizes.map((sz) => (
              <MenuItem key={sz.sizeId} value={sz.sizeId}>
                {sz.sizeName}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Màu sắc"
            value={colorId}
            onChange={(e) => setColorId(parseInt(e.target.value, 10))}
            fullWidth
          >
            {colors.map((clr) => (
              <MenuItem key={clr.colorId} value={clr.colorId}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box width={24} height={24} bgcolor={clr.colorCode} borderRadius={1} border="1px solid #ccc" />
                  {clr.colorName}
                </Box>
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Khối lượng (g)"
            type="number"
            inputProps={{ min: 1 }}
            value={weight}
            onChange={(e) => setWeight(Math.max(1, parseFloat(e.target.value) || 0))}
            error={weight <= 0}
            helperText={weight <= 0 ? "Khối lượng phải lớn hơn 0" : ""}
            fullWidth
          />
          <TextField
  label="Tồn kho tối đa"
  type="number"
  inputProps={{ min: 1 }}
  value={maxStocks}
  onChange={(e) => setMaxStocks(Math.max(1, parseInt(e.target.value) || 0))} 
  error={maxStocks <= 0}
  helperText={maxStocks <= 0 ? "Tồn kho tối đa phải lớn hơn 0" : ""}
  fullWidth
/>


          <Stack spacing={1}>
            <Button variant="outlined" component="label">
              Tải ảnh lên
              <input type="file" hidden accept="image/*" onChange={handleFileChange} />
            </Button>
            {imageFile && (
              <Typography variant="body1">Đã chọn file: {imageFile.name}</Typography>
            )}
            {previewUrl && (
              <Box
                component="img"
                src={previewUrl}
                alt="preview"
                sx={{
                  width: 1,
                  maxWidth: 300,
                  height: "auto",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                  mt: 1,
                }}
              />
            )}
          </Stack>

          {error && <Typography color="error">{error}</Typography>}

          <Stack direction="row" spacing={3} justifyContent="flex-end">
            <Button
              onClick={() => router.back()}
              disabled={submitting}
              variant="text"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              variant="contained"
              sx={{
                bgcolor: "#111",
                color: "#fff",
                px: 6,
                py: 1.5,
                '&:hover': { bgcolor: '#333' },
              }}
            >
              {submitting ? "Đang tạo..." : "Tạo"}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </Box>
  );
};

export default AddVariantPage;