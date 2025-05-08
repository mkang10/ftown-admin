// ImportDetailAccordion.tsx
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Alert,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ImportDetailItem } from "@/type/importdetail";

interface ImportDetailAccordionProps {
  detail: ImportDetailItem;
}

const statusStyles: Record<string, { bgcolor: string; color: string }> = {
  processing: { bgcolor: "#ff9800", color: "#fff" },
  success: { bgcolor: "#4caf50", color: "#fff" },
  shortage: { bgcolor: "#9c27b0", color: "#fff" },
  handled: { bgcolor: "#607d8b", color: "#fff" },
  rejected: { bgcolor: '#e57373', color: '#fff' },

};
export const ImportDetailAccordion: React.FC<ImportDetailAccordionProps> = ({ detail }) => {
  // Tính tổng số lượng thiếu nếu trạng thái là "Shortage"
  const missingTotal = detail.storeDetails.reduce((sum, store) => {
    const missing = store.allocatedQuantity - store.actualQuantity;
    const isShortage = store.status.trim().toLowerCase() === "shortage";
    return sum + (isShortage && missing > 0 ? missing : 0);
  }, 0);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          Chi Tiết Nhập ID: {detail.importDetailId} - Biến Thể Sản Phẩm ID: {detail.productVariantId}{" "}
          {missingTotal > 0 && (
            <Typography variant="caption" color="error" sx={{ ml: 1 }}>
              (Thiếu: {missingTotal})
            </Typography>
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1">
            <strong>Số Lượng:</strong> {detail.quantity}
          </Typography>
          <Typography variant="body1">
            <strong>Đơn Giá:</strong> {detail.costPrice} VND
          </Typography>
          <Typography variant="body1">
            <strong>Tên Biến Thể:</strong> {detail.productVariantName || "-"}
          </Typography>
        </Box>
        <Box sx={{ ml: 2, mt: 1 }}>
          <Typography variant="body1">
            <strong>Phân Bổ Tại Cửa Hàng:</strong>
          </Typography>
          {detail.storeDetails.map((store) => {
            const missing = store.allocatedQuantity - store.actualQuantity;
            const statusKey = store.status.trim().toLowerCase();

            const style = statusStyles[statusKey] || { bgcolor: "grey.200", color: "grey.800" };
            return (
              <Box key={store.storeId} sx={{ ml: 2, mt: 0.5 }}>
                <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <strong>Cửa Hàng ID:</strong> {store.storeId} - <strong>Tên:</strong> {store.storeName} -{' '}
                  <strong>Phân Bổ:</strong> {store.allocatedQuantity} - <strong>Thực Tế:</strong> {store.actualQuantity} -{' '}
                  <strong>Nhân Viên:</strong> {store.staffName} - <strong>Trạng Thái:</strong>{' '}
                  <Chip
                    label={store.status}
                    size="small"
                    sx={{ fontWeight: 'bold', textTransform: 'capitalize', bgcolor: style.bgcolor, color: style.color }}
                  />
                </Typography>

                {statusKey === "shortage" && missing > 0 && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Thiếu {missing} sản phẩm
                  </Alert>
                )}
              </Box>
            );
          })}
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};
