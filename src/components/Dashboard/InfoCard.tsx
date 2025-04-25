import React from 'react';
import { Card, Box, Typography, useTheme,SxProps,Theme } from '@mui/material';

interface InfoCardProps {
  title: string;
  value: React.ReactNode;
  icon: React.ReactNode;
  onClick?: () => void;
  sx?: SxProps<Theme>; // 👈 Thêm dòng này
}

const InfoCard: React.FC<InfoCardProps> = ({ title, value, icon, onClick }) => {
  const theme = useTheme();

  return (
    <Card
      onClick={onClick}
      elevation={0}
      sx={{
        borderRadius: 3,
        backgroundColor: '#fff',
        border: '1px solid #ddd',
        p: 3,
        display: 'flex',
        alignItems: 'center',
        gap: 2.5,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.25s ease-in-out',
        '&:hover': onClick
          ? {
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08)',
            }
          : {},
      }}
    >
      <Box
        sx={{
          backgroundColor: 'rgba(17, 17, 17, 0.05)', // đen nhạt trong suốt
          borderRadius: 2,
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minWidth: 48,
          minHeight: 48,
        }}
      >
        {icon}
      </Box>

      <Box>
        <Typography variant="h5" fontWeight={700} color="#111">
          {value}
        </Typography>
        <Typography variant="body2" color="#444">
          {title}
        </Typography>
      </Box>
    </Card>
  );
};

export default InfoCard;
