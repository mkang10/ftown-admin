import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { InventoryImportItem } from "@/type/importdetail";

interface ImportDetailBasicProps {
  data: InventoryImportItem;
}

const statusStyles: Record<string, { bgcolor: string; color: string }> = {
  Approved: { bgcolor: "#4caf50", color: "#fff" },
  Rejected: { bgcolor: "#f44336", color: "#fff" },
  Processing: { bgcolor: "#ff9800", color: "#fff" },
  Shortage: { bgcolor: "#9c27b0", color: "#fff" },
  Done: { bgcolor: "#2196f3", color: "#fff" },
  "Supplement Created": { bgcolor: "#607d8b", color: "#fff" },
  "Partially Approved": { bgcolor: "#ffc107", color: "#fff" },
};

const ImportDetailBasic: React.FC<ImportDetailBasicProps> = ({ data }) => {
  const { bgcolor, color } = statusStyles[data.status] || { bgcolor: "grey.200", color: "grey.800" };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Phiếu Nhập #{data.importId}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Số Tham Chiếu:</strong> {data.referenceNumber}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Người Tạo:</strong> {data.createdByName}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Ngày Tạo:</strong> {new Date(data.createdDate).toLocaleString()}
      </Typography>
      <Typography variant="body1" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <strong>Trạng Thái:</strong>
        <Chip
          label={data.status}
          size="small"
          sx={{ bgcolor, color, fontWeight: 'bold', textTransform: 'uppercase' }}
        />
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Tổng Chi Phí:</strong> {data.totalCost} VND
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Ngày Duyệt:</strong>{' '}
        {data.approvedDate ? new Date(data.approvedDate).toLocaleString() : "-"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Ngày Hoàn Tất:</strong>{' '}
        {data.completedDate ? new Date(data.completedDate).toLocaleString() : "-"}
      </Typography>
    </Box>
  );
};

export default ImportDetailBasic;