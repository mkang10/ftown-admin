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
  TableSortLabel,
} from "@mui/material";
import { TransferItem } from "antd/es/transfer";

interface TransferTableProps {
  data: TransferItem[];
  sortField: string;
  sortDirection: "asc" | "desc";
  onSortChange: (field: string) => void;
}

const TransferTable: React.FC<TransferTableProps> = ({ data, sortField, sortDirection, onSortChange }) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <TableSortLabel
                active={sortField === "transferId"}
                direction={sortField === "transferId" ? sortDirection : "asc"}
                onClick={() => onSortChange("transferId")}
              >
                Transfer ID
              </TableSortLabel>
            </TableCell>
            <TableCell>Source Warehouse</TableCell>
            <TableCell>Destination Warehouse</TableCell>
            <TableCell>
              <TableSortLabel
                active={sortField === "transferDate"}
                direction={sortField === "transferDate" ? sortDirection : "asc"}
                onClick={() => onSortChange("transferDate")}
              >
                Transfer Date
              </TableSortLabel>
            </TableCell>
            {/* Thêm các cột khác nếu cần */}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((transfer) => (
            <TableRow key={transfer.transferId}>
              <TableCell>{transfer.transferId}</TableCell>
              <TableCell>{transfer.sourceWarehouse}</TableCell>
              <TableCell>{transfer.destinationWarehouse}</TableCell>
              <TableCell>{new Date(transfer.transferDate).toLocaleString()}</TableCell>
              {/* Hiển thị các trường khác nếu có */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TransferTable;
