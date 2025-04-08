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
    let newDirection: "asc" | "desc" = "asc";
    if (sortField === field && sortDirection === "asc") {
      newDirection = "desc";
    }
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
                direction={sortField === "ReferenceNumber" ? sortDirection : "asc"}
                onClick={createSortHandler("ReferenceNumber")}
              >
                Reference Number
              </TableSortLabel>
            </TableCell>
            <TableCell className="hidden" align="left">
              <TableSortLabel
                active={sortField === "CreatedByName"}
                direction={sortField === "CreatedByName" ? sortDirection : "asc"}
                onClick={createSortHandler("CreatedByName")}
              >
                Importer
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={sortField === "TotalCost"}
                direction={sortField === "TotalCost" ? sortDirection : "asc"}
                onClick={createSortHandler("TotalCost")}
              >
                Total Cost
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={sortField === "Status"}
                direction={sortField === "Status" ? sortDirection : "asc"}
                onClick={createSortHandler("Status")}
              >
                Status
              </TableSortLabel>
            </TableCell>
            <TableCell align="center">
              <TableSortLabel
                active={sortField === "CreatedDate"}
                direction={sortField === "CreatedDate" ? sortDirection : "asc"}
                onClick={createSortHandler("CreatedDate")}
              >
                Date Imported
              </TableSortLabel>
            </TableCell>
            <TableCell align="center" sx={{ fontWeight: "bold" }}>
              Action
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
              <TableCell align="center">{row.totalCost}</TableCell>
              <TableCell align="center">
                {row.status === "Pending" && (
                  <Chip
                    label="PENDING"
                    size="small"
                    sx={{ bgcolor: "grey.100", color: "grey.700" }}
                  />
                )}
                {row.status === "Approved" && <Chip label="APPROVED" size="small" color="success" />}
                {row.status === "Rejected" && <Chip label="REJECTED" size="small" color="error" />}
                {row.status === "Processing" && <Chip label="PROCESSING" size="small" color="warning" />}
                {row.status === "Done" && <Chip label="DONE" size="small" color="info" />}
                {row.status === "Partial Success" && (
                  <Chip label="PARTIAL SUCCESS" size="small" sx={{ bgcolor: "orange.200", color: "orange.900" }} />
                )}
                  {row.status === "Supplement Created" && (
                  <Chip label="SUPPLEMENT CREATED" size="small" sx={{ bgcolor: "orange.200", color: "orange.900" }} />
                )}
              </TableCell>

              <TableCell align="center">
                {new Date(row.createdDate).toLocaleString()}
              </TableCell>
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
                      Approve
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
                      Reject
                    </Button>
                  </Box>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No Action
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
