// app/owner/layout.tsx
"use client";

import React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
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
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            zIndex: 100,
          }}
        >
          <Navbar />
          <main style={{ flex: 1, padding: "16px" }}>{children}</main>
        </div>
      </div>
    </ThemeProvider>
  );
}
