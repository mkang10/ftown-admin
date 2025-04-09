import { Dispatch } from "@/type/dispatch";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
} from "@mui/material";

interface DispatchTableProps {
    data: Dispatch[];
    onSortChange: (field: string) => void;
    sortField: string;
    sortDirection: "asc" | "desc";
  }

  export default function DispatchTable({
    data,
    onSortChange,
    sortField,
    sortDirection,
  }: DispatchTableProps) {
  return (
    <Paper>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Mã</TableCell>
            <TableCell>Trạng thái</TableCell>
            <TableCell>Ngày tạo</TableCell>
            <TableCell>Người tạo</TableCell>
            <TableCell>Sản phẩm</TableCell>
            <TableCell>Số lượng</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((dispatch) => {
            const details = dispatch.dispatchDetails?.map(d => ({
              name: d.productName,
              quantity: d.quantity,
            })) || [];

            return (
              <TableRow key={dispatch.dispatchId}>
                <TableCell>{dispatch.referenceNumber}</TableCell>
                <TableCell>{dispatch.status}</TableCell>
                <TableCell>{new Date(dispatch.createdDate).toLocaleString()}</TableCell>
                <TableCell>{dispatch.createdByName}</TableCell>
                <TableCell>
                  <Box>
                    {details.map((d, idx) => (
                      <Typography key={idx} variant="body2">{d.name}</Typography>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                    {details.map((d, idx) => (
                      <Typography key={idx} variant="body2">{d.quantity}</Typography>
                    ))}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
