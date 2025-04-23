import React, { useState } from 'react';
import { Box, Button, Typography, IconButton, Fade, FormControlLabel, Checkbox } from '@mui/material';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export interface Image {
  productImageId: number;
  url: string;
  isMain: boolean;
}

interface Props {
  images: Image[];
  onToggleMain: (imgId: number) => void;
  onDelete: (imgId: number) => void;
}

export default function ExistingImagesCarousel({ images, onToggleMain, onDelete }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeIn, setFadeIn] = useState(true);

  if (!images.length) return null;

  const handlePrev = () => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev === 0 ? images.length - 1 : prev - 1));
      setFadeIn(true);
    }, 150);
  };

  const handleNext = () => {
    setFadeIn(false);
    setTimeout(() => {
      setCurrentIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
      setFadeIn(true);
    }, 150);
  };

  const currentImage = images[currentIndex];

  return (
    <Box sx={{ mt: 3, position: 'relative' }}>
      <Typography variant="subtitle1" gutterBottom>
        Ảnh hiện tại
      </Typography>

      <Box sx={{ position: 'relative', height: 300 }}>
        {/* Delete button */}
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => onDelete(currentImage.productImageId)}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            fontSize: '0.75rem',
          }}
        >
          Xóa
        </Button>

        {/* Toggle Main Checkbox */}
        <Box
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 2,
            bgcolor: 'rgba(0,0,0,0.5)',
            borderRadius: 2,
            px: 1.5,
            py: 0.5,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Checkbox
            checked={currentImage.isMain}
            onChange={() => onToggleMain(currentImage.productImageId)}
            sx={{ color: 'white', p: 0.5 }}
          />
          <Typography variant="caption" sx={{ color: 'white', ml: 0.5 }}>
            Đặt làm ảnh chính
          </Typography>
        </Box>

        {/* Navigation buttons */}
        {images.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: 'absolute',
                top: '50%',
                left: 8,
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'rgba(0,0,0,0.3)',
                color: '#fff',
              }}
            >
              <ArrowBackIosNewIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: 'absolute',
                top: '50%',
                right: 8,
                transform: 'translateY(-50%)',
                zIndex: 2,
                bgcolor: 'rgba(0,0,0,0.3)',
                color: '#fff',
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </>
        )}

        {/* Image */}
        <Fade in={fadeIn} timeout={300}>
          <Box
            component="img"
            src={currentImage.url}
            alt="existing image"
            sx={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              borderRadius: 2,
              border: theme =>
                currentImage.isMain
                  ? `2px solid ${theme.palette.primary.main}`
                  : '1px solid #ccc',
              display: 'block',
            }}
          />
        </Fade>

        {/* Main status */}
        <Box sx={{ position: 'absolute', bottom: 8, left: 8, zIndex: 2 }}>
          <Typography
            variant="caption"
            sx={{
              bgcolor: currentImage.isMain ? 'primary.main' : 'grey.500',
              color: '#fff',
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
            }}
          >
            {currentImage.isMain ? 'Ảnh chính' : 'Ảnh phụ'}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}