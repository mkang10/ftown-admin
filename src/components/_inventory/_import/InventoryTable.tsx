"use client";

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Box,
  Button,
  Chip,
  Typography,
  TableSortLabel,
} from "@mui/material";
import { InventoryImportItem } from "@/type/InventoryImport";
import { useRouter } from "next/navigation";

interface InventoryTableProps {
  data: InventoryImportItem[];
  onAction: (
    action: "Approved" | "Rejected",
    importId: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSortChange: (field: string, direction: "asc" | "desc") => void;
}

const InventoryTable: React.FC<InventoryTableProps> = ({
  data,
  onAction,
  sortField,
  sortDirection,
  onSortChange,
}) => {
  const router = useRouter();

  const handleRowClick = (importId: number) => {
    router.push(`/dashboard/inventory/import/${importId}`);
  };

  const createSortHandler = (field: string) => () => {
    // Default to descending, toggle to ascending if already descending
    const isSameField = sortField === field;
    const newDirection: "asc" | "desc" = isSameField && sortDirection === "desc" ? "asc" : "desc";
    onSortChange(field, newDirection);
  };

  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "grey.100" }}>
            <TableCell align="left">
              <TableSortLabel
                active={sortField === "ReferenceNumber"}
                direction={sortField === "ReferenceNumber" ? sortDirection : "desc"}
                onClick={createSortHandler("ReferenceNumber")}
              >
                Số tham chiếu
              </TableSortLabel>
            </TableCell>
            <TableCell className="hidden" align="left">
              <TableSortLabel
                active={sortField === "CreatedByName"}
                direction={sortField === "CreatedByName" ? sortDirection : "desc"}
                onClick={createSortHandler("CreatedByName")}
              >
                Người tạo phiếu
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={sortField === "TotalCost"}
                direction={sortField === "TotalCost" ? sortDirection : "desc"}
                onClick={createSortHandler("TotalCost")}
              >
                Tổng chi phí
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={sortField === "Status"}
                direction={sortField === "Status" ? sortDirection : "desc"}
                onClick={createSortHandler("Status")}
              >
                Trạng thái
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={sortField === "CreatedDate"}
                direction={sortField === "CreatedDate" ? sortDirection : "desc"}
                onClick={createSortHandler("CreatedDate")}
              >
                Ngày nhập
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Hành động
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.importId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => handleRowClick(row.importId)}
            >
              <TableCell align="left">{row.referenceNumber}</TableCell>
              <TableCell className="hidden" align="left">{row.createdByName}</TableCell>
              <TableCell align="center">{row.totalCost}VND</TableCell>
              <TableCell align="center">
                {row.status === "Pending" && (
                  <Chip
                    label="Pending"
                    size="small"
                    sx={{ bgcolor: "grey.100", color: "grey.700" }}
                  />
                )}
                {row.status === "Approved" && (
                  <Chip label="Approved" size="small" sx={{ bgcolor: "#4caf50", color: "#fff" }} />
                )}
                {row.status === "Rejected" && (
                  <Chip label="Rejected" size="small" sx={{ bgcolor: "#f44336", color: "#fff" }} />
                )}
                {row.status === "Processing" && (
                  <Chip label="Processing" size="small" sx={{ bgcolor: "#ff9800", color: "#fff" }} />
                )}
                {row.status === "Done" && (
                  <Chip label="Done" size="small" sx={{ bgcolor: "#2196f3", color: "#fff" }} />
                )}
                {row.status === "Shortage" && (
                  <Chip label="Shortage" size="small" sx={{ bgcolor: "#9c27b0", color: "#fff" }} />
                )}
                {row.status === "Supplement Created" && (
                  <Chip label="Supplement Created" size="small" sx={{ bgcolor: "#607d8b", color: "#fff" }} />
                )}
                {row.status === "Partially Approved" && (
                  <Chip label="Partially Approved" size="small" sx={{ bgcolor: "#ffc107", color: "#fff" }} />
                )}
              </TableCell>

              <TableCell align="center">{row.createdDate}</TableCell>
              <TableCell align="center">
                {row.status === "Pending" ? (
                  <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction("Approved", row.importId, e);
                      }}
                    >
                      Duyệt
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAction("Rejected", row.importId, e);
                      }}
                    >
                      Từ chối
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Không có hành động
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default InventoryTable;
