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
      case "Pending":
        return (
          <Chip
            label="PENDING"
            size="small"
            sx={{ bgcolor: "grey.100", color: "grey.700" }}
          />
        );
      case "Approved":
        return <Chip label="APPROVED" size="small" color="success" />;
      case "Rejected":
        return <Chip label="REJECTED" size="small" color="error" />;
      case "Processing":
        return <Chip label="PROCESSING" size="small" color="warning" />;
      case "Done":
        return <Chip label="DONE" size="small" color="info" />;
      case "Partial Success":
        return (
          <Chip
            label="PARTIAL SUCCESS"
            size="small"
            sx={{ bgcolor: "orange.200", color: "orange.900" }}
          />
        );
      case "Supplement Created":
        return (
          <Chip
            label="SUPPLEMENT CREATED"
            size="small"
            sx={{ bgcolor: "orange.200", color: "orange.900" }}
          />
        );
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
                  Transfer Order ID
                </TableSortLabel>
              ) : (
                "Transfer Order ID"
              )}
            </TableCell>
            <TableCell align="left">
              {onSortChange && sortField ? (
                <TableSortLabel
                  active={sortField === "importReferenceNumber"}
                  direction={
                    sortField === "importReferenceNumber" ? sortDirection : "asc"
                  }
                  onClick={createSortHandler("importReferenceNumber")}
                >
                  Import Ref. No.
                </TableSortLabel>
              ) : (
                "Import Ref. No."
              )}
            </TableCell>
            <TableCell align="left">
              {onSortChange && sortField ? (
                <TableSortLabel
                  active={sortField === "dispatchReferenceNumber"}
                  direction={
                    sortField === "dispatchReferenceNumber" ? sortDirection : "asc"
                  }
                  onClick={createSortHandler("dispatchReferenceNumber")}
                >
                  Dispatch Ref. No.
                </TableSortLabel>
              ) : (
                "Dispatch Ref. No."
              )}
            </TableCell>
            <TableCell align="left">
              {onSortChange && sortField ? (
                <TableSortLabel
                  active={sortField === "createdByName"}
                  direction={sortField === "createdByName" ? sortDirection : "asc"}
                  onClick={createSortHandler("createdByName")}
                >
                  Created By
                </TableSortLabel>
              ) : (
                "Created By"
              )}
            </TableCell>
            <TableCell align="center">
              {onSortChange && sortField ? (
                <TableSortLabel
                  active={sortField === "createdDate"}
                  direction={sortField === "createdDate" ? sortDirection : "asc"}
                  onClick={createSortHandler("createdDate")}
                >
                  Created Date
                </TableSortLabel>
              ) : (
                "Created Date"
              )}
            </TableCell>
            <TableCell align="center">
              {onSortChange && sortField ? (
                <TableSortLabel
                  active={sortField === "status"}
                  direction={sortField === "status" ? sortDirection : "asc"}
                  onClick={createSortHandler("status")}
                >
                  Status
                </TableSortLabel>
              ) : (
                "Status"
              )}
            </TableCell>
            <TableCell align="left">Remarks</TableCell>
            {onAction && (
              <TableCell align="center" sx={{ fontWeight: "bold" }}>
                Action
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
                        color="success"
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          onAction("Approved", row.transferOrderId, e);
                        }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="contained"
                        color="error"
                        size="small"
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
