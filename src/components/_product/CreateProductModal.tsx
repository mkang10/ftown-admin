import React, { useState, useEffect } from 'react';
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Divider,
  Stack,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { toast } from 'react-toastify';
import { CreateProductRequest } from '@/type/CreateProduct';
import { createProduct } from '@/ultis/Product';
import { fetchCategories } from '@/ultis/categoryapi';
import { Category } from '@/type/category';

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState<CreateProductRequest>({
    name: '',
    description: '',
    categoryId: 0,
    origin: '',
    model: '',
    occasion: '',
    style: '',
    material: '',
    status: 'Draft',
    images: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  useEffect(() => {
    if (!open) return;
    (async () => {
      try {
        setLoadingCategories(true);
        const { data } = await fetchCategories();
        setCategories(data || []);
      } catch {
        toast.error('Không thể tải danh mục');
      } finally {
        setLoadingCategories(false);
      }
    })();
  }, [open]);

  const handleChange = (key: keyof CreateProductRequest, value: any) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const handleFileAdd = (file: File) => {
    setForm(prev => ({ ...prev, images: [...prev.images, file] }));
  };

  const handleFileRemove = (index: number) => {
    setForm(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async () => {
    const validImages = form.images.filter(f => f.size > 0);
    try {
      const payload = { ...form, images: validImages };
      const res = await createProduct(payload);
      if (res.status) {
        toast.success(res.message);
        onSuccess();
        onClose();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error('Lỗi khi tạo sản phẩm');
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: 600 },
          bgcolor: '#fff',
          color: '#000',
          p: 3,
          borderRadius: 3,
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
          <Typography variant="h5" sx={{ fontWeight: 700, letterSpacing: 1 }}>
            Tạo sản phẩm
          </Typography>
          <IconButton onClick={onClose} sx={{ color: '#000' }}>
            <CloseIcon />
          </IconButton>
        </Stack>

        <Divider sx={{ borderColor: '#ddd', mb: 3 }} />

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Tên sản phẩm"
              value={form.name}
              onChange={e => handleChange('name', e.target.value)}
              variant="outlined"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Model"
              value={form.model}
              onChange={e => handleChange('model', e.target.value)}
              variant="outlined"
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Mô tả"
              value={form.description}
              onChange={e => handleChange('description', e.target.value)}
              variant="outlined"
            />
          </Grid>

          {['origin', 'occasion', 'style', 'material'].map((field, idx) => (
            <Grid item xs={6} sm={3} key={field}>
              <TextField
                fullWidth
                label={{ origin: 'Xuất xứ', occasion: 'Dịp', style: 'Phong cách', material: 'Chất liệu' }[field]}
                value={(form as any)[field]}
                onChange={e => handleChange(field as any, e.target.value)}
                variant="outlined"
              />
            </Grid>
          ))}

          <Grid item xs={12} sm={6}>
            <FormControl fullWidth variant="outlined">
              <InputLabel id="category-label">Danh mục</InputLabel>
              {loadingCategories ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Select
                  labelId="category-label"
                  label="Danh mục"
                  value={form.categoryId}
                  onChange={e => handleChange('categoryId', e.target.value)}
                >
                  <MenuItem value={0} disabled>
                    Chọn danh mục
                  </MenuItem>
                  {categories.map(cat => (
                    <MenuItem key={cat.categoryId} value={cat.categoryId}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
              Ảnh sản phẩm
            </Typography>
            <Grid container spacing={1}>
              {form.images.map((file, i) => (
                <Grid item key={i} xs={4}>
                  <Box
                    sx={{
                      position: 'relative',
                      border: '1px dashed #000',
                      borderRadius: 1,
                      height: 100,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      bgcolor: '#fafafa',
                    }}
                  >
                    {file.size > 0 ? (
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        style={{ maxHeight: '90%', maxWidth: '90%', objectFit: 'contain' }}
                      />
                    ) : (
                      <AddPhotoAlternateIcon sx={{ fontSize: 40, color: '#bbb' }} />
                    )}
                    <IconButton
                      size="small"
                      onClick={() => handleFileRemove(i)}
                      sx={{ position: 'absolute', top: 2, right: 2, bgcolor: '#fff' }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <input
                      type="file"
                      accept="image/*"
                      hidden
                      onChange={e => e.target.files && handleFileAdd(e.target.files[0])}
                    />
                  </Box>
                </Grid>
              ))}

              <Grid item xs={4}>
                <Button
                  component="label"
                  variant="outlined"
                  fullWidth
                  sx={{ height: 100, borderColor: '#000', color: '#000' }}
                >
                  Thêm ảnh
                  <input hidden type="file" accept="image/*" onChange={e => e.target.files && handleFileAdd(e.target.files[0])} />
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Divider sx={{ borderColor: '#ddd', my: 3 }} />

        <Box textAlign="right">
          <Button
            variant="contained"
            onClick={handleSubmit}
            sx={{
              textTransform: 'none',
              px: 4,
              py: 1.5,
              bgcolor: '#000',
              color: '#fff',
              fontWeight: 600,
              '&:hover': { bgcolor: '#333' },
            }}
          >
            Tạo sản phẩm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
