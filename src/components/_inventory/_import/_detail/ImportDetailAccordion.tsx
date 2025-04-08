// ImportDetailAccordion.tsx
import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Box,
  Typography,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ImportDetailItem } from "@/type/importdetail";

interface ImportDetailAccordionProps {
  detail: ImportDetailItem;
}

export const ImportDetailAccordion: React.FC<ImportDetailAccordionProps> = ({ detail }) => {
  // Tính tổng số item thiếu chỉ nếu status là Shortage
  const missingTotal = detail.storeDetails.reduce((sum, store) => {
    const missing = store.allocatedQuantity - store.actualQuantity;
    const isShortage = store.status.trim().toLowerCase() === "shortage";
    return sum + (isShortage && missing > 0 ? missing : 0);
  }, 0);

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>
          Import Detail ID: {detail.importDetailId} - Product Variant ID: {detail.productVariantId}{" "}
          {missingTotal > 0 && (
            <Typography variant="caption" color="error" sx={{ ml: 1 }}>
              (Missing: {missingTotal})
            </Typography>
          )}
        </Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Box sx={{ mb: 1 }}>
          <Typography variant="body1">
            <strong>Quantity:</strong> {detail.quantity}
          </Typography>
          <Typography variant="body1">
            <strong>Product Variant Name:</strong> {detail.productVariantName || "-"}
          </Typography>
        </Box>
        <Box sx={{ ml: 2, mt: 1 }}>
          <Typography variant="body1">
            <strong>Store Allocations:</strong>
          </Typography>
          {detail.storeDetails.map((store) => {
            const missing = store.allocatedQuantity - store.actualQuantity;
            const isShortage = store.status.trim().toLowerCase() === "shortage";
            return (
              <Box key={store.storeId} sx={{ ml: 2, mt: 0.5 }}>
                <Typography variant="body2">
                  <strong>Store ID:</strong> {store.storeId} -{" "}
                  <strong>Name:</strong> {store.storeName} -{" "}
                  <strong>Allocated:</strong> {store.allocatedQuantity} -{" "}
                  <strong>Actual:</strong> {store.actualQuantity} -{" "}
                  <strong>Staff:</strong> {store.staffName} -{" "}
                  <strong>Status:</strong> {store.status.trim()}
                </Typography>

                {isShortage && missing > 0 && (
                  <Alert severity="error" sx={{ mt: 1 }}>
                    Missing {missing} item{missing > 1 ? "s" : ""}
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
