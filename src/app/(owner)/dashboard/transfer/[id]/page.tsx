"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Tabs,
  Tab,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import { getTransferById } from "@/ultis/transferapi";
import { TransferResponseDto } from "@/type/transferdetail"; 

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel({ children, value, index }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}
const renderValue = (value: any) => {
    if (typeof value === "object" && value !== null) {
      return (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="medium">Chi tiết</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={1}>
              {Object.entries(value).map(([k, v]) => (
                <Grid item xs={12} key={k}>
                  <Typography variant="caption" color="text.secondary">
                    {k}
                  </Typography>
                  <Typography variant="body2">
                    {typeof v === "object" && v !== null ? JSON.stringify(v, null, 2) : String(v)}
                  </Typography>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      );
    }
    return <Typography variant="body2">{String(value)}</Typography>;
  };
const TransferDetailPage: React.FC = () => {
  const params = useParams();
  const id = Number(params?.id);
  const [data, setData] = useState<TransferResponseDto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (!id) return;
    getTransferById(id)
      .then((res) => setData(res))
      .catch((err) => setError(err.message || "Lỗi tải dữ liệu"))
      .finally(() => setLoading(false));
  }, [id]);

  const handleTabChange = (_: React.SyntheticEvent, newIndex: number) => {
    setTabIndex(newIndex);
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  if (error)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  if (!data)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <Typography>Không tìm thấy dữ liệu Transfer.</Typography>
      </Box>
    );

  const { jsonTransfer, jsonImport, jsonDispatch, auditLogs } = data;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        Chi tiết Transfer #{jsonTransfer.transferOrderId}
      </Typography>
      <Divider sx={{ mb: 3 }} />

      <Paper sx={{ borderRadius: 2, boxShadow: 3, mb: 3 }}>
        <Tabs value={tabIndex} onChange={handleTabChange} centered>
          <Tab label="Transfer" />
          <Tab label="Import" />
          <Tab label="Dispatch" />
          <Tab label="Audit Logs" />
        </Tabs>
      </Paper>

      {/* Transfer Tab */}
      <TabPanel value={tabIndex} index={0}>
        <Card sx={{ mb: 3, borderRadius: 2, boxShadow: 3 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Transfer Summary
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Transfer Order ID
                </Typography>
                <Typography variant="body1">{jsonTransfer.transferOrderId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Import ID
                </Typography>
                <Typography variant="body1">{jsonTransfer.importId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Dispatch ID
                </Typography>
                <Typography variant="body1">{jsonTransfer.dispatchId}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created By
                </Typography>
                <Typography variant="body1">{jsonTransfer.createdBy || '-'}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Created Date
                </Typography>
                <Typography variant="body1">
                  {new Date(jsonTransfer.createdDate).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Status
                </Typography>
                <Chip label={jsonTransfer.status.toUpperCase()} size="small" />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2" color="text.secondary">
                  Remarks
                </Typography>
                <Typography variant="body1">
                  {jsonTransfer.remarks || '-'}
                </Typography>
              </Grid>
              {jsonTransfer.originalTransferOrderId !== null && (
                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Original Transfer Order ID
                  </Typography>
                  <Typography variant="body1">
                    {jsonTransfer.originalTransferOrderId}
                  </Typography>
                </Grid>
              )}
            </Grid>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h6" gutterBottom>
              Transfer Details
            </Typography>
            {jsonTransfer.detailsTransferOrder.map((d) => (
              <Accordion key={d.transferOrderDetailId} disableGutters>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography fontWeight={600}>
                    Detail #{d.transferOrderDetailId}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Product
                      </Typography>
                      <Typography variant="body2">
                        {d.product?.name || '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Quantity
                      </Typography>
                      <Typography variant="body2" color="primary">
                        {d.quantity}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Delivered Quantity
                      </Typography>
                      <Typography variant="body2">
                        {d.deliveredQuantity ?? '-'}
                      </Typography>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Source Store ID
                      </Typography>
                      <Typography variant="body2">
                        {d.sourceStoreId}
                      </Typography>
                    </Grid>
                  </Grid>
                </AccordionDetails>
              </Accordion>
            ))}
          </CardContent>
        </Card>
      </TabPanel>

            {/* Import Tab */}
            <TabPanel value={tabIndex} index={1}>
                <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Typography variant="h6">Import Summary</Typography>
                        <Grid container spacing={2}>
                            {Object.entries(jsonImport).map(([key, value]) => {
                                if (key === "details") return null;
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={key}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {key}
                                        </Typography>
                                        <Typography variant="body1">
                                            {value !== null ? String(value) : "-"}
                                        </Typography>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">Import Details</Typography>
                            {jsonImport.details.map((item) => (
                                <Accordion key={item.importDetailId} disableGutters>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>
                                            Import Detail #{item.importDetailId}
                                        </Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={2}>
                                            {Object.entries(item).map(([ik, iv]) => {
                                                if (ik === "storeImportDetail") return null;
                                                return (
                                                    <Grid item xs={12} sm={6} key={ik}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            {ik}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {iv !== null ? String(iv) : "-"}
                                                        </Typography>
                                                    </Grid>
                                                );
                                            })}

                                            <Box sx={{ width: "100%", mt: 2 }}>
                                                <Typography variant="subtitle2">
                                                    Store Import Details
                                                </Typography>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            {Object.keys(
                                                                item.storeImportDetail[0]
                                                            ).map((col) => (
                                                                <TableCell key={col}>{col}</TableCell>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {item.storeImportDetail.map((row, ri) => (
                                                            <TableRow key={ri}>
                                                                {Object.values(row).map((val, ci) => (
                                                                    <TableCell key={ci}>
                                                                        {val !== null ? String(val) : "-"}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>
                    </CardContent>
                </Card>
            </TabPanel>

            {/* Dispatch Tab */}
            <TabPanel value={tabIndex} index={2}>
                <Card sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}>
                    <CardContent>
                        <Grid container spacing={2}>
                            {Object.entries(jsonDispatch).map(([key, value]) => {
                                if (key === "details") return null;
                                return (
                                    <Grid item xs={12} sm={6} md={4} key={key}>
                                        <Typography variant="subtitle2" color="text.secondary">
                                            {key}
                                        </Typography>
                                        <Typography variant="body1">
                                            {value !== null ? String(value) : "-"}
                                        </Typography>
                                    </Grid>
                                );
                            })}
                        </Grid>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6">Dispatch Details</Typography>
                            {jsonDispatch.details.map((item: any) => (
                                <Accordion key={item.dispatchDetailId} disableGutters>
                                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                        <Typography>Dispatch Detail #{item.dispatchDetailId}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={2}>
                                            {Object.entries(item).map(([ik, iv]) => {
                                                if (ik === "storeExportDetail") return null;
                                                return (
                                                    <Grid item xs={12} sm={6} key={ik}>
                                                        <Typography variant="subtitle2" color="text.secondary">
                                                            {ik}
                                                        </Typography>
                                                        <Typography variant="body2">
                                                            {iv !== null ? String(iv) : "-"}
                                                        </Typography>
                                                    </Grid>
                                                );
                                            })}

                                            <Box sx={{ width: "100%", mt: 2 }}>
                                                <Typography variant="subtitle2">
                                                    Store Export Details
                                                </Typography>
                                                <Table size="small">
                                                    <TableHead>
                                                        <TableRow>
                                                            {item.storeExportDetail?.length > 0 &&
                                                                Object.keys(item.storeExportDetail[0]).map((col) => (
                                                                    <TableCell key={col}>{col}</TableCell>
                                                                ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        {item.storeExportDetail?.map((row: any, ri: number) => (
                                                            <TableRow key={ri}>
                                                                {Object.values(row).map((val, ci) => (
                                                                    <TableCell key={ci}>
                                                                        {val !== null ? String(val) : "-"}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>
                                                        ))}
                                                    </TableBody>
                                                </Table>
                                            </Box>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            ))}
                        </Box>

                    </CardContent>
                </Card>
            </TabPanel>

         {/* Audit Logs Tab */}
         <TabPanel value={tabIndex} index={3}>
        <Typography variant="h6" gutterBottom>
          Audit Logs
        </Typography>
        {auditLogs.length === 0 ? (
          <Typography>Không có log nào được ghi nhận.</Typography>
        ) : (
          auditLogs.map((log) => {
            let parsedData: Record<string, any> = {};
            try {
              parsedData = JSON.parse(log.changeData);
            } catch {
              parsedData = { raw: log.changeData };
            }
            return (
              <Card key={log.auditLogId} sx={{ mb: 2, borderRadius: 2, boxShadow: 1 }}>
                <CardContent>
                  <Typography variant="subtitle2" color="text.secondary">
                    {log.operation} by {log.changedBy} on {new Date(log.changeDate).toLocaleString()}
                  </Typography>
                  {log.comment && (
                    <Typography variant="body2" sx={{ mt: 1, mb: 2 }}>
                      {log.comment}
                    </Typography>
                  )}

                  <Typography variant="subtitle2" gutterBottom>
                    Change Data
                  </Typography>
                  <Grid container spacing={2}>
                    {Object.entries(parsedData).map(([key, value]) => (
                      <Grid item xs={12} sm={6} md={4} key={key}>
                        <Typography variant="subtitle2" color="text.secondary">
                          {key}
                        </Typography>
                        {renderValue(value)}
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </Card>
            );
          })
        )}
      </TabPanel>
        </Box>
    );
};

export default TransferDetailPage;