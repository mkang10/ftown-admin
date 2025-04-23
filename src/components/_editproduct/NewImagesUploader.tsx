import React, { ChangeEvent } from 'react';
import { Box, Button, Grid, Checkbox, FormControlLabel, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export type NewImage = { file: File; isMain: boolean };

type Props = {
  images: NewImage[];
  onAdd: (files: NewImage[]) => void;
  onToggleMain: (idx: number) => void;
  onDelete: (idx: number) => void;
};

export default function NewImagesUploader({ images, onAdd, onToggleMain, onDelete }: Props) {
  const handleNewFiles = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).map(file => ({ file, isMain: false }));
    onAdd(files);
  };

  if (!images) return null;
  return (
    <Box sx={{ mb: 2 }}>
      <Typography>New Images</Typography>
      <Button variant="outlined" component="label">
        Chọn file ảnh
        <input hidden multiple type="file" accept="image/*" onChange={handleNewFiles} />
      </Button>
      <Grid container spacing={1} sx={{ mt: 1 }}>
        {images.map((img, idx) => (
          <Grid item key={idx} sx={{ position: 'relative' }}>
            <img src={URL.createObjectURL(img.file)} alt="" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 4 }} />
            <FormControlLabel control={<Checkbox checked={img.isMain} onChange={() => onToggleMain(idx)} />} label="Main" />
            <IconButton sx={{ position: 'absolute', top: 0, right: 0, background: 'rgba(255,255,255,0.7)' }} onClick={() => onDelete(idx)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}

