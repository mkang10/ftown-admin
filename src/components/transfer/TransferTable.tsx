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
import { TransferOrderItem } from "@/type/transfer";
import { useRouter } from "next/navigation";

interface TransferTableProps {
  data: TransferOrderItem[];
  onAction?: (
    action: "Approved" | "Rejected",
    transferOrderId: number,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void;
  sortField?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (field: string, direction: "asc" | "desc") => void;
}

const TransferTable: React.FC<TransferTableProps> = ({
  data,
  onAction,
  sortField,
  sortDirection,
  onSortChange,
}) => {
  const router = useRouter();

  const handleRowClick = (transferOrderId: number) => {
    router.push(`/dashboard/transfer/${transferOrderId}`);
  };

  const createSortHandler = (field: string) => () => {
    if (onSortChange && sortField) {
      let newDirection: "asc" | "desc" = "asc";
      if (sortField === field && sortDirection === "asc") {
        newDirection = "desc";
      }
      onSortChange(field, newDirection);
    }
  };

  const renderStatusChip = (status: string) => {
    switch (status) {
      case "Approved":
        return <Chip label="APPROVED" size="small" sx={{ bgcolor: "#4caf50", color: "#fff" }} />;
      case "Done":
        return <Chip label="DONE" size="small" sx={{ bgcolor: "#2196f3", color: "#fff" }} />;
      default:
        return <Chip label={status.toUpperCase()} size="small" />;
    }
  };
  
  return (
    <TableContainer component={Paper} sx={{ boxShadow: 3 }}>
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "grey.100" }}>
            <TableCell align="left">
              {onSortChange && sortField ? (
                <TableSortLabel
                  active={sortField === "transferOrderId"}
                  direction={sortField === "transferOrderId" ? sortDirection : "asc"}
                  onClick={createSortHandler("transferOrderId")}
                >
                  Mã phiếu chuyển
                </TableSortLabel>
              ) : (
                "Mã phiếu chuyển"
              )}
            </TableCell>
            <TableCell align="left">
              {onSortChange && sortField ? (
                <TableSortLabel
                  active={sortField === "importReferenceNumber"}
                  direction={sortField === "importReferenceNumber" ? sortDirection : "asc"}
                  onClick={createSortHandler("importReferenceNumber")}
                >
                  Số tham chiếu nhập
                </TableSortLabel>
              ) : (
                "Số tham chiếu nhập"
              )}
            </TableCell>
            <TableCell align="left">
              {onSortChange && sortField ? (
                <TableSortLabel
                  active={sortField === "dispatchReferenceNumber"}
                  direction={sortField === "dispatchReferenceNumber" ? sortDirection : "asc"}
                  onClick={createSortHandler("dispatchReferenceNumber")}
                >
                  Số tham chiếu xuất
                </TableSortLabel>
              ) : (
                "Số tham chiếu xuất"
              )}
            </TableCell>
            <TableCell align="left">
              {onSortChange && sortField ? (
                <TableSortLabel
                  active={sortField === "createdByName"}
                  direction={sortField === "createdByName" ? sortDirection : "asc"}
                  onClick={createSortHandler("createdByName")}
                >
                  Người tạo
                </TableSortLabel>
              ) : (
                "Người tạo"
              )}
            </TableCell>
            <TableCell align="center">
              {onSortChange && sortField ? (
                <TableSortLabel
                  active={sortField === "createdDate"}
                  direction={sortField === "createdDate" ? sortDirection : "asc"}
                  onClick={createSortHandler("createdDate")}
                >
                  Ngày tạo
                </TableSortLabel>
              ) : (
                "Ngày tạo"
              )}
            </TableCell>
            <TableCell align="center">
              {onSortChange && sortField ? (
                <TableSortLabel
                  active={sortField === "status"}
                  direction={sortField === "status" ? sortDirection : "asc"}
                  onClick={createSortHandler("status")}
                >
                  Trạng thái
                </TableSortLabel>
              ) : (
                "Trạng thái"
              )}
            </TableCell>
            <TableCell align="left">Ghi chú</TableCell>
            {onAction && (
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Thao tác
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {data.map((row) => (
            <TableRow
              key={row.transferOrderId}
              hover
              sx={{ cursor: "pointer" }}
              onClick={() => handleRowClick(row.transferOrderId)}
            >
              <TableCell align="left">{row.transferOrderId}</TableCell>
              <TableCell align="left">{row.importReferenceNumber}</TableCell>
              <TableCell align="left">{row.dispatchReferenceNumber}</TableCell>
              <TableCell align="left">{row.createdByName}</TableCell>
              <TableCell align="center">
                {new Date(row.createdDate).toLocaleString()}
              </TableCell>
              <TableCell align="center">{renderStatusChip(row.status)}</TableCell>
              <TableCell align="left">{row.remarks || "-"}</TableCell>
              {onAction && (
                <TableCell align="center">
                  {row.status === "Pending" ? (
                    <Box sx={{ display: "flex", justifyContent: "center", gap: 1 }}>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: "#4caf50", color: "#fff", '&:hover': { bgcolor: '#43a047' } }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAction("Approved", row.transferOrderId, e);
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: "#f44336", color: "#fff", '&:hover': { bgcolor: '#e53935' } }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAction("Rejected", row.transferOrderId, e);
                        }}
                      >
                        Reject
                      </Button>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      No Action
                    </Typography>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransferTable;
