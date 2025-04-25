"use client";

import React, { useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Grid,
} from "@mui/material";
import { ImportDetailItem } from "@/type/importdetail";
import { createSupplementInventoryImport } from "@/ultis/importapi";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface CreateSupplementModalProps {
  open: boolean;
  onClose: () => void;
  missingDetails: ImportDetailItem[];
  originalImportId: number;
  onSuccess: () => void;
}

export const CreateSupplementModal: React.FC<CreateSupplementModalProps> = ({
  open,
  onClose,
  missingDetails,
  originalImportId,
  onSuccess,
}) => {
  const router = useRouter();
  // Dùng ref cho từng input unitPrice
  const unitPriceRefs = useRef<{ [productVariantId: number]: HTMLInputElement | null }>({});
  
  const handleCreate = async () => {
    const importDetails = missingDetails.map((item) => ({
      productVariantId: item.productVariantId,
      costPrice: Number(unitPriceRefs.current[item.productVariantId]?.value || 0),
    }));

    try {
      const response = await createSupplementInventoryImport({
        originalImportId,
        importDetails,
      });

      if (response.status) {
        toast.success("Tạo đơn bổ sung thành công!");

        // Cập nhật lại dữ liệu phía server mà không thay đổi cấu trúc UI
        router.refresh();

        // Callback để cập nhật UI tại component cha (ví dụ: cập nhật danh sách đơn bổ sung mới)
        onSuccess();

        // Đóng modal
        onClose();
      } else {
        toast.error(response.message || "Tạo đơn thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi tạo đơn bổ sung");
      console.error("Error in handleCreate:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo đơn bổ sung</DialogTitle>
      <DialogContent dividers>
        <Box>
          {missingDetails.map((item) => (
            <Box key={item.productVariantId} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {item.productVariantName}
              </Typography>
              <Grid container spacing={2} display={"none"}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Unit Price"
                    type="hidden"
                    inputRef={(ref) => {
                      unitPriceRefs.current[item.productVariantId] = ref;
                    }}
                    fullWidth
                    placeholder="Nhập đơn giá"
                  />
                </Grid>
              </Grid>
            </Box>
          ))}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleCreate} color="primary">
          Tạo đơn
        </Button>
      </DialogActions>
    </Dialog>
  );
};
