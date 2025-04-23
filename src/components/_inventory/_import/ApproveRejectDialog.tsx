"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Slide,
  Divider,
} from "@mui/material";
import { TransitionProps } from "@mui/material/transitions";

// Tạo hiệu ứng trượt từ dưới lên
const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ApproveRejectDialogProps {
  open: boolean;
  actionType: "Approved" | "Rejected" | null;
  comment: string;
  onClose: () => void;
  onSubmit: () => void;
  onCommentChange: (value: string) => void;
}

export default function ApproveRejectDialog({
  open,
  actionType,
  comment,
  onClose,
  onSubmit,
  onCommentChange,
}: ApproveRejectDialogProps) {
  const isApprove = actionType === "Approved";

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          backgroundColor: "#fff",
          borderRadius: 3,
          boxShadow: "0 12px 30px rgba(0, 0, 0, 0.2)",
          overflow: "hidden",
        },
      }}
    >
      <Box sx={{ backgroundColor: "#000", py: 2, px: 3 }}>
        <Typography
          variant="h6"
          sx={{
            color: "#fff",
            textAlign: "center",
            fontWeight: 700,
            letterSpacing: 1,
          }}
        >
          {isApprove ? "XÁC NHẬN NHẬP KHO" : "TỪ CHỐI NHẬP KHO"}
        </Typography>
      </Box>

      <DialogContent sx={{ px: 3, pt: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
          Ghi chú của bạn
        </Typography>

        <TextField
          placeholder="Nhập ghi chú chi tiết (nếu có)..."
          fullWidth
          multiline
          rows={4}
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          variant="outlined"
          sx={{
            backgroundColor: "#f5f5f5",
            "& .MuiOutlinedInput-root": {
              borderRadius: 2,
              "& fieldset": {
                borderColor: "#000",
              },
              "&:hover fieldset": {
                borderColor: "#333",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#000",
              },
            },
          }}
        />
      </DialogContent>

      <Divider sx={{ my: 2 }} />

      <DialogActions
        sx={{
          justifyContent: "space-between",
          px: 3,
          pb: 3,
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#000",
            color: "#000",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#000",
              color: "#fff",
            },
          }}
        >
          Hủy
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          sx={{
            backgroundColor: "#000",
            color: "#fff",
            fontWeight: 700,
            textTransform: "none",
            "&:hover": {
              backgroundColor: "#fff",
              color: "#000"
            },
          }}
        >
          Xác nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
}
