// ImportDetailDetails.tsx
import React, { useMemo, useState } from "react";
import { Box, Button } from "@mui/material";
import { ImportDetailItem, AuditLog } from "@/type/importdetail";
import { ImportDetailAccordion } from "./ImportDetailAccordion";
import { CreateSupplementModal } from "./CreateSupplementModal";
import { AuditLogDisplay } from "./AuditLogDisplay";

interface ImportDetailDetailsProps {
  details: ImportDetailItem[];
  auditLogs: AuditLog[];
  originalImportId: number;
}

export const ImportDetailDetails: React.FC<ImportDetailDetailsProps> = ({
  details,
  auditLogs,
  originalImportId,
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
        onSuccess={() => {
          // Callback sau khi tạo đơn
        }}
      />
    </Box>
  );
};
