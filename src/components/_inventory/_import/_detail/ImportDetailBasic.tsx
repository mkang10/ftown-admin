// components/inventory/import/ImportDetailBasic.tsx
import React from "react";
import { Box, Typography } from "@mui/material";
import { InventoryImportItem } from "@/type/importdetail";

interface ImportDetailBasicProps {
  data: InventoryImportItem;
}

const ImportDetailBasic: React.FC<ImportDetailBasicProps> = ({ data }) => {
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
      <Typography variant="body1" gutterBottom>
        <strong>Trạng Thái:</strong> {data.status}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Tổng Chi Phí:</strong> {data.totalCost} VND
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Ngày Duyệt:</strong>{" "}
        {data.approvedDate ? new Date(data.approvedDate).toLocaleString() : "-"}
      </Typography>
      <Typography variant="body1" gutterBottom>
        <strong>Ngày Hoàn Tất:</strong>{" "}
        {data.completedDate ? new Date(data.completedDate).toLocaleString() : "-"}
      </Typography>
    </Box>
  );
};

export default ImportDetailBasic;
