import React from 'react';
import {
  Typography,
  Card,
  CardContent,
  Grid,
  Divider,
} from '@mui/material';
import { AuditLogDto } from '@/type/transferdetail';

interface AuditLogsTabProps {
  auditLogs: AuditLogDto[];
}

const AuditLogsTab: React.FC<AuditLogsTabProps> = ({ auditLogs }) => (
  <>
    <Typography variant="h6" gutterBottom sx={{ color: '#000' }}>
      Nhật ký thay đổi
    </Typography>
    {auditLogs.length === 0 ? (
      <Typography sx={{ color: '#000' }}>Không có log nào được ghi nhận.</Typography>
    ) : (
      auditLogs.map((log) => {
        let parsedData = {} as Record<string, any>;
        return (
          <Card key={log.auditLogId} sx={{ mb: 2, borderRadius: 1, boxShadow: 1, bgcolor: '#fff' }}>
            <CardContent>
              <Typography variant="subtitle2" sx={{ color: '#555' }}>
                {log.operation} bởi {log.changedByName} vào {new Date(log.changeDate).toLocaleString('vi-VN')}
              </Typography>
              {log.comment && <Typography variant="body2" sx={{ mt: 1, mb: 2, color: '#000' }}>{log.comment}</Typography>}
              <Divider sx={{ mb: 2, borderColor: '#eee' }} />
              <Grid container spacing={2}>
                {Object.entries(parsedData).map(([key, value]) => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <Typography variant="subtitle2" sx={{ color: '#555' }}>{key}</Typography>
                    <Typography variant="body2" sx={{ color: '#000' }}>
                      {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                    </Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        );
      })
    )}
  </>
);

export default AuditLogsTab;