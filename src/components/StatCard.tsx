"use client";

import React from "react";
import { Box, Paper, Typography } from "@mui/material";

interface StatsCardProps {
  title: string;
  value: string;
  percentage?: string; // Thêm thuộc tính percentage
  icon?: React.ReactNode; // Thêm thuộc tính icon
  bgColor?: string; // Thêm thuộc tính bgColor
  image?: string; // Đường dẫn ảnh, ví dụ rocket
}

export default function StatsCard({ title, value, percentage, icon, bgColor, image }: StatsCardProps) {
  return (
    <Paper
      sx={{
        p: 2,
        borderRadius: 4,
        boxShadow: 4,
        transition: "transform 0.3s",
        "&:hover": {
          transform: "scale(1.03)", // Hiệu ứng phình ra
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: bgColor || "white", // Sử dụng màu nền nếu có
      }}
    >
      {image && (
        <Box
          component="img"
          src={image}
          alt="card image"
          sx={{
            width: 80,
            height: 80,
            mb: 1,
            objectFit: "cover",
          }}
        />
      )}
      {icon && <Box sx={{ mb: 1 }}>{icon}</Box>} {/* Hiển thị icon nếu có */}
      <Typography variant="subtitle1" color="text.secondary">
        {title}
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        {value}
      </Typography>
      {percentage && (
        <Typography variant="body2" color="text.secondary">
          {percentage}
        </Typography> // Hiển thị percentage nếu có
      )}
    </Paper>
  );
}