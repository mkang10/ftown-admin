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
  Chip,
  Tooltip,
} from "@mui/material";
import { useRouter } from "next/navigation";
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
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "Approved":
        return { bgcolor: "#4caf50", color: "#fff" };
      case "Processing":
        return { bgcolor: "#ff9800", color: "#fff" };
      case "Done":
        return { bgcolor: "#2196f3", color: "#fff" };
      default:
        return { bgcolor: "grey.200", color: "grey.800" };
    }
  };
  
  const router = useRouter(); // ✅ khởi tạo router

  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: 3,
        overflow: "hidden",
        mt: 3,
      }}
    >
      <Table>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
            <TableCell>
              <Typography variant="subtitle2" fontWeight="bold">
                Mã
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight="bold">
                Trạng thái
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight="bold">
                Ngày tạo
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight="bold">
                Người tạo
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight="bold">
                Sản phẩm
              </Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2" fontWeight="bold">
                Số lượng
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((dispatch) => {
            const details =
              dispatch.dispatchDetails?.map((d) => ({
                name: d.productName,
                quantity: d.quantity,
              })) || [];

            return (
              <TableRow

                key={dispatch.dispatchId}
                hover
                sx={{ transition: "all 0.2s", "&:hover": { backgroundColor: "#f9f9f9" } }}
                onClick={() => router.push(`/dashboard/inventory/dispatch/${dispatch.dispatchId}`)}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {dispatch.referenceNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={dispatch.status}
                    variant="outlined"
                    size="small"
                    sx={{
                      fontWeight: "bold",
                      textTransform: "capitalize",
                      ...getStatusStyle(dispatch.status),
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body2">
                    {new Date(dispatch.createdDate).toLocaleString()}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2">{dispatch.createdByName}</Typography>
                </TableCell>
                <TableCell>
                  <Box>
                    {details.map((d, idx) => (
                      <Tooltip title={d.name} key={idx}>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{ maxWidth: 180 }}
                        >
                          • {d.name}
                        </Typography>
                      </Tooltip>
                    ))}
                  </Box>
                </TableCell>
                <TableCell>
                  <Box>
                    {details.map((d, idx) => (
                      <Typography
                        variant="body2"
                        key={idx}
                        sx={{ fontWeight: 500 }}
                      >
                        {d.quantity}
                      </Typography>
                    ))}
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Paper>
  );
}
