"use client";

import React, { useState } from "react";
import { Box, List, Divider, IconButton, Typography } from "@mui/material";
import {
  FiHome,
  FiBox,
  FiShoppingCart,
  FiClipboard,
  FiUserCheck,
  FiTrendingUp,
  FiSettings,
  FiLogOut,
} from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import SidebarItem from "./SidebarItem";
import SidebarDropdown from "./SidebarDropdown";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    router.push("/");
  };

  // Hàm mở sidebar
  const openSidebar = () => {
    setIsOpen(true);
  };

  return (
    <Box
      sx={{
        width: isOpen ? 240 : 80,
        bgcolor: "#ffffff",
        p: 2,
        borderRadius: 2,
        boxShadow: "0px 0px 10px rgba(0,0,0,0.15)",
        transition: "width 0.3s",
        overflow: "visible",
        position: "relative",
        border: "1px solid #e0e0e0",
        display: "flex", // ✅ thêm
        flexDirection: "column", // ✅ thêm
        height: "100%", // ✅ đảm bảo fill theo cha
      }}
    >
      {/* Logo container with toggle button */}
      <Box sx={{ position: "relative", mb: 2 }}>
        <Box
          sx={{
            transition: "transform 0.5s",
            transform: isOpen ? "rotate(360deg)" : "rotate(0deg)",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            src="/assets/logo.avif"
            alt="Shop Manager"
            width={120}
            height={120}
            priority
            className="rounded-full object-cover"
          />
        </Box>
        {/* Toggle button: ô tròn nằm ở cạnh phải, dịch chuyển 50% ra bên ngoài */}
        <IconButton
          onClick={() => setIsOpen(!isOpen)}
          size="small"
          sx={{
            position: "absolute",
            top: "50%",
            right: -28, // Button nằm 28px bên ngoài container
            transform: "translateY(-50%)",
            bgcolor: "background.paper",
            border: "1px solid #ccc",
            borderRadius: "50%",
            zIndex: 999,
            transition: "transform 0.5s, background-color 0.5s",
            "&:hover": { bgcolor: "grey.200" },
          }}
        >
          <Box
            sx={{
              transition: "transform 0.5s",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            {isOpen ? <FiChevronRight size={20} /> : <FiChevronRight size={20} />}
          </Box>
        </IconButton>
      </Box>

      {/* Menu list */}
      <List>
        <SidebarItem
          icon={<FiHome />}
          label="Trang chủ"
          route="/dashboard"
          isOpen={isOpen}
        />

        <SidebarItem
          route="/dashboard/product"
          icon={<FiBox />}
          label="Sản phẩm"
          isOpen={isOpen}
      
          
        />

        <SidebarDropdown
          id="orders"
          icon={<FiShoppingCart />}
          label="Đơn hàng"
          isOpen={isOpen}
          subItems={[
            { label: "Xác nhận đơn", route: "/orders/confirmation" },
            { label: "Vận chuyển", route: "/orders/delivery" },
            { label: "Xử lý khiếu nại", route: "/orders/complaints" },
          ]}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
          openSidebar={openSidebar}
        />

        <SidebarDropdown
          id="inventory"
          icon={<FiClipboard />}
          label="Phiếu kho"
          isOpen={isOpen}
          subItems={[
            { label: "Nhập kho", route: "/dashboard/inventory/import" },
            { label: "Xuất kho", route: "/dashboard/inventory/dispatch" },
          ]}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
          openSidebar={openSidebar}
        />

        <SidebarItem
          icon={<FiUserCheck />}
          label="Điều chuyển"
          route="/dashboard/transfer"
          isOpen={isOpen}
        />
        <SidebarItem
          icon={<FiTrendingUp />}
          label="Kho tổng"
          route="/dashboard/warehouse"
          isOpen={isOpen}
        />

        <SidebarDropdown
          id="reports"
          icon={<FiSettings />}
          label="Báo cáo"
          isOpen={isOpen}
          subItems={[
            { label: "Hiệu suất bán hàng", route: "/reports/sales" },
            { label: "Báo cáo quản lý", route: "/reports/management" },
          ]}
          activeDropdown={activeDropdown}
          setActiveDropdown={setActiveDropdown}
          openSidebar={openSidebar}
        />
      </List>


      <Divider sx={{ my: 2,  }} />

      {/* Logout */}
      <Box
        onClick={handleLogout}
        sx={{
          display: "flex",
          alignItems: "center",
          cursor: "pointer",
          p: 1,
          mt: "auto", // ✅ đẩy logout xuống cuối
          zIndex : 10000000
          
        }}
      >
        <Box sx={{ mr: isOpen ? 1 : 0 }}>
          <FiLogOut />
        </Box>
        {isOpen && <Typography  variant="body2">Logout </Typography>}
      </Box>
    </Box>
  );
};

export default Sidebar;
