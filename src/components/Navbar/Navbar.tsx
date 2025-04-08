"use client";

import React from "react";
import { AppBar, Toolbar, Typography, Box, IconButton } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function Navbar() {
  // Tuỳ chọn state nếu cần toggle menu
  const handleMenuClick = () => {
    alert("Menu clicked!");
  };

  return (
    <AppBar
      position="static"
      color="inherit"
      sx={{
        boxShadow: 2, // Mức shadow “mềm”
        borderRadius: 2,
        mx: 2,
        mt: 2,
        mb: 1,
      }}
    >
      <Toolbar>
        {/* <IconButton edge="start" color="primary" onClick={handleMenuClick}>
          <MenuIcon />
        </IconButton> */}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          FunkyTown Owner 
        </Typography>
        {/* Có thể thêm avatar, notifications… */}
        {/* <Box sx={{ cursor: "pointer" }}>Sign In</Box> */}
      </Toolbar>
    </AppBar>
  );
}
