"use client";

import React, { useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import { toast } from "react-toastify";
import { ImportDetailItem, AuditLog } from "@/type/importdetail";
import { ImportDetailAccordion } from "./ImportDetailAccordion";
import { CreateSupplementModal } from "./CreateSupplementModal";
import { AuditLogDisplay } from "./AuditLogDisplay";
import { useRouter } from "next/navigation";  // Import useRouter từ next/navigation

interface ImportDetailDetailsProps {
  details: ImportDetailItem[];
  auditLogs: AuditLog[];
  originalImportId: number;
  onReload?: () => void; // Thêm prop mới

}

export const ImportDetailDetails: React.FC<ImportDetailDetailsProps> = ({
  details,
  auditLogs,
  originalImportId,
  onReload
}) => {
  // Chỉ tính thiếu khi status === "Shortage"
  const missingDetails = useMemo(() => {
    return details.filter((detail) => {
      return detail.storeDetails.some((store) => {
        const missing = store.allocatedQuantity - store.actualQuantity;
        const isShortage = store.status.trim().toLowerCase() === "shortage";
        return isShortage && missing > 0;
      });
    });
  }, [details]);

  const [openModal, setOpenModal] = useState<boolean>(false);
  const router = useRouter(); // Khởi tạo router để sử dụng refresh

  // Callback khi tạo đơn bổ sung thành công: hiển thị toast, đóng modal và refresh trang
  const handleSuccess = () => {
    toast.success("Tạo đơn bổ sung thành công!");
    setOpenModal(false);
    onReload?.(); // Gọi lại fetchDetail từ trang cha
  };

  return (
    <Box sx={{ mt: 2 }}>
      {details.map((detail) => (
        <ImportDetailAccordion key={detail.importDetailId} detail={detail} />
      ))}

      {/* Hiển thị Audit Log */}
      <AuditLogDisplay auditLogs={auditLogs} />

      {/* Nút chỉ hiển thị nếu có thiếu đúng điều kiện */}
      {missingDetails.length > 0 && (
        <Box sx={{ mt: 2, textAlign: "center" }}>
          <Button variant="contained" color="error" onClick={() => setOpenModal(true)}>
            Tạo đơn bổ sung
          </Button>
        </Box>
      )}

      <CreateSupplementModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        missingDetails={missingDetails}
        originalImportId={originalImportId}
        onSuccess={handleSuccess} // Gọi callback sau khi tạo đơn thành công
      />
    </Box>
  );
};
