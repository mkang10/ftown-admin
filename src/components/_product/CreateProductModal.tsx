import React, { useState, useEffect, ChangeEvent } from 'react';
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
  Chip,
  OutlinedInput,
  Collapse,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import RemoveIcon from '@mui/icons-material/Remove';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { toast } from 'react-toastify';
import { CreateProductRequest } from '@/type/CreateProduct';
import { createProduct } from '@/ultis/Product';
import { fetchCategories } from '@/ultis/categoryapi';
import { Category } from '@/type/category';

const STYLE_OPTIONS = ['Casual','Formal','Vintage','Streetwear','Bohemian','Sporty','Minimalist','Grunge'];
const ORIGIN_OPTIONS = ['Việt Nam','USA','Japan','China','Italy','France'];
const OCCASION_OPTIONS = ['Daily','Party','Office','Wedding','Travel','Sports'];
const MATERIAL_OPTIONS = ['Cotton','Leather','Polyester','Silk','Denim','Wool'];

interface CreateProductModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const CreateProductModal: React.FC<CreateProductModalProps> = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState<CreateProductRequest>({
    name: '', description: '', categoryId: 0,
    origin: '', model: '', occasion: '', style: '', material: '', status: 'Draft', images: [],
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [sectionsOpen, setSectionsOpen] = useState({ meta: true, details: false });

  useEffect(() => {
    if (!open) return;
    (async () => {
      setLoadingCategories(true);
      try {
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
  const handleFileAdd = (file: File) => setForm(prev => ({ ...prev, images: [...prev.images, file] }));
  const handleFileRemove = (i: number) => setForm(prev => ({ ...prev, images: prev.images.filter((_, idx) => idx !== i) }));

  const handleSubmit = async () => {
    try {
      const payload = { ...form, images: form.images.filter(f => f.size > 0) };
      const res = await createProduct(payload);
      if (res.status) { toast.success(res.message); onSuccess(); onClose(); }
      else toast.error(res.message);
    } catch {
      toast.error('Lỗi khi tạo sản phẩm');
    }
  };

  const renderChipSelect = (label: string, value: string, options: string[], key: keyof CreateProductRequest) => (
    <FormControl fullWidth variant="outlined">
      <InputLabel>{label}</InputLabel>
      <Select
        displayEmpty
        value={value}
        onChange={e => handleChange(key, e.target.value)}
        input={<OutlinedInput label={label} />}
        renderValue={val => val ? <Chip label={val} size="small" /> : <span style={{ color: '#aaa' }}> </span>}
        IconComponent={ExpandMoreIcon}
      >
        <MenuItem value=""><em>None</em></MenuItem>
        {options.map(opt => (
          <MenuItem key={opt} value={opt}>
            <Chip label={opt} size="small" />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: { xs: '95%', sm: 600 }, bgcolor: '#fff', borderRadius: 4, boxShadow: 6, p: 4, maxHeight: '90vh', overflowY: 'auto' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" fontWeight={700}>Tạo sản phẩm</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Stack>
        <Divider />

        {/* Metadata Section */}
        <Box mt={2} mb={1} onClick={() => setSectionsOpen(prev => ({ ...prev, meta: !prev.meta }))} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Thông tin cơ bản</Typography>
          <ExpandMoreIcon sx={{ transform: sectionsOpen.meta ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
        </Box>
        <Collapse in={sectionsOpen.meta} timeout="auto">
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Tên sản phẩm" value={form.name} onChange={e => handleChange('name', e.target.value)} /></Grid>
            <Grid item xs={12} sm={6}><TextField fullWidth label="Mẫu" value={form.model} onChange={e => handleChange('model', e.target.value)} /></Grid>
            <Grid item xs={12}><TextField fullWidth multiline rows={3} label="Mô tả" value={form.description} onChange={e => handleChange('description', e.target.value)} /></Grid>
            <Grid item xs={6} sm={3}>{renderChipSelect('Xuất xứ', form.origin, ORIGIN_OPTIONS, 'origin')}</Grid>
            <Grid item xs={6} sm={3}>{renderChipSelect('Dịp', form.occasion, OCCASION_OPTIONS, 'occasion')}</Grid>
            <Grid item xs={6} sm={3}>{renderChipSelect('Phong cách', form.style, STYLE_OPTIONS, 'style')}</Grid>
            <Grid item xs={6} sm={3}>{renderChipSelect('Chất liệu', form.material, MATERIAL_OPTIONS, 'material')}</Grid>
          </Grid>
        </Collapse>

        <Divider sx={{ my: 3 }} />

        {/* Category Section */}
        <Box mb={1} onClick={() => setSectionsOpen(prev => ({ ...prev, details: !prev.details }))} sx={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Typography variant="h6">Danh mục và Ảnh</Typography>
          <ExpandMoreIcon sx={{ transform: sectionsOpen.details ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }} />
        </Box>
        <Collapse in={sectionsOpen.details} timeout="auto">
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined">
                <InputLabel>Danh mục</InputLabel>
                {loadingCategories ? <Box sx={{ display: 'flex', justifyContent: 'center', p: 1 }}><CircularProgress size={24} /></Box> : (
                  <Select label="Danh mục" value={form.categoryId} onChange={e => handleChange('categoryId', e.target.value)} IconComponent={ExpandMoreIcon}>
                    <MenuItem value={0} disabled>Chọn danh mục</MenuItem>
                    {categories.map(cat => <MenuItem key={cat.categoryId} value={cat.categoryId}>{cat.name}</MenuItem>)}
                  </Select>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" fontWeight={600} mb={1}>Ảnh sản phẩm</Typography>
              <Grid container spacing={1} sx={{ mt: 1 }}>
                {form.images.map((file, i) => (
                  <Grid item xs={4} key={i}>
                    <Box sx={{ position: 'relative', border: '1px dashed #ccc', borderRadius: 2, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#fafafa' }}>
                      {file.size > 0 ? <img src={URL.createObjectURL(file)} alt="preview" style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <AddPhotoAlternateIcon fontSize='large' color='disabled' />}
                      <IconButton size='small' onClick={() => handleFileRemove(i)} sx={{ position: 'absolute', top: 4, right: 4, bgcolor: '#fff' }}><RemoveIcon fontSize='small' /></IconButton>
                    </Box>
                  </Grid>
                ))}
                <Grid item xs={4}>
                  <Button component='label' variant='outlined' fullWidth sx={{ height: 120, borderColor: '#000', color: '#000' }}>
                    Thêm ảnh
                    <input hidden type='file' accept='image/*' onChange={e => e.target.files && handleFileAdd(e.target.files[0])} />
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Collapse>

        <Box textAlign='right' mt={3}>
          <Button variant='contained' onClick={handleSubmit} sx={{ px: 4, py: 1.5, bgcolor: '#000', color: '#fff', fontWeight: 600, textTransform: 'none', '&:hover': { bgcolor: '#333' } }}>
            Tạo sản phẩm
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};
