import React from 'react';
import { Box, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Category } from '@/type/category';

type Props = {
  data: Record<string, any>;
  categories: Category[];
  onChange: (data: Record<string, any>) => void;
};

export default function ProductDetailsForm({ data, categories, onChange }: Props) {
  const handleField = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...data, [field]: e.target.value });
  };

  return (
    <Box sx={{ mb: 2 }}>
      <TextField fullWidth label="Name" value={data.name ?? ''} onChange={handleField('name')} sx={{ mb: 2 }} />
      <TextField fullWidth multiline label="Description" value={data.description ?? ''} onChange={handleField('description')} sx={{ mb: 2 }} />
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select value={data.categoryId ?? ''} label="Category" onChange={e => onChange({ ...data, categoryId: Number(e.target.value) })}>
          <MenuItem value="">-- Chọn danh mục --</MenuItem>
          {categories.map(cat => <MenuItem key={cat.categoryId} value={cat.categoryId}>{cat.name}</MenuItem>)}
        </Select>
      </FormControl>
      {['origin','model','occasion','style','material','status'].map(key => (
        <TextField key={key} fullWidth label={key.charAt(0).toUpperCase() + key.slice(1)} value={data[key] ?? ''} onChange={handleField(key)} sx={{ mb: 2 }} />
      ))}
    </Box>
  );
}
