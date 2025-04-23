import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Box, TextField, Button, CircularProgress
} from '@mui/material';
import { createWarehouse } from '@/ultis/warehouseapi';

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateWarehouseModal: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    warehouseName: '',
    warehouseDescription: '',
    location: '',
    email: '',
    phone: '',
    warehouseType: '',
    shopManagerId: '',
    imageFile: null as File | null
  });
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: string, value: any) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, val]) => {
        if (key === 'imageFile' && val) fd.append('ImageFile', val as File);
        else if (val) {
          const apiKey = key.charAt(0).toUpperCase() + key.slice(1);
          fd.append(apiKey, String(val));
        }
      });
      await createWarehouse(fd);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Create Warehouse</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} mt={1}>
          <TextField label="Name" fullWidth value={form.warehouseName} onChange={e => handleChange('warehouseName', e.target.value)} />
          <TextField label="Description" fullWidth value={form.warehouseDescription} onChange={e => handleChange('warehouseDescription', e.target.value)} />
          <TextField label="Location" fullWidth value={form.location} onChange={e => handleChange('location', e.target.value)} />
          <TextField label="Email" fullWidth value={form.email} onChange={e => handleChange('email', e.target.value)} />
          <TextField label="Phone" fullWidth value={form.phone} onChange={e => handleChange('phone', e.target.value)} />
          <TextField label="Type" fullWidth value={form.warehouseType} onChange={e => handleChange('warehouseType', e.target.value)} />
          <TextField label="Shop Manager ID" type="number" fullWidth value={form.shopManagerId} onChange={e => handleChange('shopManagerId', e.target.value)} />
          <Button variant="outlined" component="label">
            Upload Image
            <input type="file" hidden accept="image/*" onChange={e => handleChange('imageFile', e.target.files?.[0] || null)} />
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={submitting}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" disabled={submitting}>
          {submitting ? <CircularProgress size={24} /> : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateWarehouseModal;