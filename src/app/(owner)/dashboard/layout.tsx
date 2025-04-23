"use client";

import React from "react";
import {
  CssBaseline,
  ThemeProvider,
  createTheme,
  Box,
} from "@mui/material";
import Navbar from "@/components/Navbar/Navbar";
import Sidebar from "@/components/Sidebar/Sidebar";
import type { Shadows } from "@mui/material/styles";

const customShadows: Shadows = [
  "none",
  ...Array(24).fill("0 5px 10px rgba(0,0,0,0.07)"),
] as Shadows;

const theme = createTheme({
  palette: {
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    primary: {
      main: "#2152ff",
    },
    secondary: {
      main: "#21d4fd",
    },
  },
  shape: {
    borderRadius: 12,
  },
  shadows: customShadows,
});

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "stretch", // ✅ Đây là mấu chốt
        }}
      >
        {/* Sidebar giữ nguyên chiều cao bằng content */}
        <Box sx={{ flexShrink: 0 }}>
          <Sidebar />
        </Box>

        {/* Main content */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Navbar />
          <Box component="main" sx={{ flex: 1, p: 2 }}>
            {children}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
}
