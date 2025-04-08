"use client";

import React from "react";
import Link from "next/link";
import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Collapse,
  List,
} from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

interface SubItem {
  label: string;
  route: string;
}

interface SidebarDropdownProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  subItems: SubItem[];
  isOpen: boolean;
  activeDropdown: string | null;
  setActiveDropdown: (id: string | null) => void;
  openSidebar: () => void; // function để mở sidebar khi đang đóng
}

const SidebarDropdown: React.FC<SidebarDropdownProps> = ({
  id,
  icon,
  label,
  subItems,
  isOpen,
  activeDropdown,
  setActiveDropdown,
  openSidebar,
}) => {
  const handleClick = () => {
    if (!isOpen) {
      // Nếu sidebar đang đóng, mở sidebar và mở dropdown cho item này
      openSidebar();
      setActiveDropdown(id);
      return;
    }
    // Nếu sidebar đang mở, toggle dropdown
    setActiveDropdown(activeDropdown === id ? null : id);
  };

  const isDropdownOpen = activeDropdown === id && isOpen;

  return (
    <>
      <ListItemButton onClick={handleClick} sx={{ borderRadius: 1 }}>
        <ListItemIcon>{icon}</ListItemIcon>
        {isOpen && <ListItemText primary={label} />}
        {isOpen && (isDropdownOpen ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>
      <Collapse in={isDropdownOpen} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {subItems.map((subItem, index) => (
            <Link key={index} href={subItem.route} passHref>
              <ListItemButton sx={{ pl: 4 }}>
                <ListItemText primary={subItem.label} />
              </ListItemButton>
            </Link>
          ))}
        </List>
      </Collapse>
    </>
  );
};

export default SidebarDropdown;
