"use client";
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Divider,
} from "@mui/material";
import WarehouseSelectDialog from "./WarehouseSelectDialog";
import TransferDetailsForm from "./TransferDetailsForm";
import toast from "react-hot-toast";
import { createTransfer } from "@/ultis/transferapi";
import { TransferCreateRequest, TransferDetail } from "@/type/CreateTransfer";
import { Warehouse } from "@/type/warehouse";

interface CreateTransferModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateTransferModal: React.FC<CreateTransferModalProps> = ({
  open,
  onClose,
  onSuccess,
}) => {
  const [createdBy, setCreatedBy] = useState<number | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("account");
      if (raw) {
        const acc = JSON.parse(raw);
        setCreatedBy(acc.accountId);
      } else {
        console.warn("Không tìm thấy tài khoản trong localStorage");
      }
    } catch (e) {
      console.error("Lỗi khi lấy tài khoản từ localStorage", e);
    }
  }, []);

  const [sourceWarehouse, setSourceWarehouse] = useState<Warehouse | null>(null);
  const [destinationWarehouse, setDestinationWarehouse] = useState<Warehouse | null>(null);
  const [transferDetails, setTransferDetails] = useState<TransferDetail[]>([
    { variantId: 0, quantity: 0, costPrice: 0 },
  ]);

  const handleSubmit = async () => {
    if (!createdBy) {
      toast.error("Người dùng chưa xác thực.");
      return;
    }
  
    if (!sourceWarehouse || !destinationWarehouse) {
      toast.error("Vui lòng chọn cả kho nguồn và kho đích.");
      return;
    }
  
    if (sourceWarehouse.warehouseId === destinationWarehouse.warehouseId) {
      toast.error("Kho nguồn và kho đích không được trùng nhau.");
      return;
    }
  
    // Kiểm tra số lượng > 0
    const invalidDetail = transferDetails.find(
      (detail) => !detail.variantId || detail.quantity <= 0
    );
    if (invalidDetail) {
      toast.error("Số lượng sản phẩm phải lớn hơn 0.");
      return;
    }
  
    const payload: TransferCreateRequest = {
      createdBy,
      sourceWarehouseId: sourceWarehouse.warehouseId,
      destinationWarehouseId: destinationWarehouse.warehouseId,
      transferDetails,
    };
  
    try {
      const result = await createTransfer(payload);
      toast.success("Tạo phiếu chuyển thành công. Tệp sẽ được tải xuống ngay.");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error("Lỗi khi tạo phiếu chuyển:", err);
      const data = err.response?.data;
      const errorMessage =
        typeof data === "string"
          ? data
          : data?.message || data?.title || err.message || "Đã xảy ra lỗi khi tạo phiếu chuyển";
      toast.error(errorMessage);
    }
  };
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Tạo phiếu chuyển</DialogTitle>
      <DialogContent>
        {/* Kho nguồn */}
        <Box sx={{ my: 2 }}>
          <WarehouseSelectDialog
            label="Kho nguồn"
            selectedWarehouse={sourceWarehouse || undefined}
            onSelect={setSourceWarehouse}
          />
        </Box>
        <Divider />
        {/* Kho đích */}
        <Box sx={{ my: 2 }}>
          <WarehouseSelectDialog
            label="Kho đích"
            selectedWarehouse={destinationWarehouse || undefined}
            onSelect={setDestinationWarehouse}
          />
        </Box>
        <Divider />
        {/* Chi tiết phiếu chuyển */}
        <Box sx={{ my: 2 }}>
          {transferDetails.map((detail, idx) => (
            <Box key={idx} sx={{ mb: 2 }}>
              <TransferDetailsForm
                index={idx}
                detail={detail}
                onChange={(updated) => {
                  const newDetails = [...transferDetails];
                  newDetails[idx] = updated;
                  setTransferDetails(newDetails);
                }}
                onRemove={() => {
                  setTransferDetails((td) => td.filter((_, i) => i !== idx));
                }}
                selectedVariantIds={transferDetails.map((d) => d.variantId)}
              />
            </Box>
          ))}

          <Button
            variant="outlined"
            onClick={() =>
              setTransferDetails((td) => [
                ...td,
                { variantId: 0, quantity: 0, costPrice: 0 },
              ])
            }
            fullWidth
          >
            + Thêm sản phẩm khác
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Tạo phiếu
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateTransferModal;
