// AuditLogDisplay.tsx
import React from "react";
import {
  Box,
  Typography,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { AuditLog } from "@/type/importdetail";
import { RenderValue } from "./RenderValue";

interface AuditLogDisplayProps {
  auditLogs: AuditLog[];
}

export const AuditLogDisplay: React.FC<AuditLogDisplayProps> = ({ auditLogs }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Nhật ký thay đổi
      </Typography>
      {auditLogs.map((log) => (
        <Accordion key={log.auditLogId}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>
              Mã Nhật Ký: {log.auditLogId} - Thao Tác: {log.operation}
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Bảng:</strong> {log.tableName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Người Thay Đổi:</strong> {log.changedByName}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Thời Gian:</strong> {log.changeDate}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body1">
                  <strong>Ghi Chú:</strong> {log.comment}
                </Typography>
              </Grid>
              <Grid item xs={12}>
                {/* <Typography variant="body1">
                  <strong>Dữ Liệu Thay Đổi:</strong>
                </Typography>
                <RenderValue
                  value={
                    (() => {
                      try {
                        return JSON.parse(log.changeData);
                      } catch (error) {
                        return log.changeData;
                      }
                    })()
                  }
                /> */}
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
};
