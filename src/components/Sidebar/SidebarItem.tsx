"use client";

import React from "react";
import Link from "next/link";
import { ListItemButton, ListItemIcon, ListItemText } from "@mui/material";

interface SidebarItemProps {
  icon: React.ReactNode;
  label: string;
  route: string;
  isOpen: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ icon, label, route, isOpen }) => {
  return (
    <Link href={route} passHref>
      <ListItemButton sx={{ borderRadius: 1 }}>
        <ListItemIcon>{icon}</ListItemIcon>
        {isOpen && <ListItemText primary={label} />}
      </ListItemButton>
    </Link>
  );
};

export default SidebarItem;
