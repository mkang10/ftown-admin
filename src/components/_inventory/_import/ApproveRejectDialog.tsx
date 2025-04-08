"use client";

import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from "@mui/material";

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
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>
        {actionType === "Approved" ? "Approved Inventory Import" : "Rejected Inventory Import"}
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Comments"
          fullWidth
          multiline
          rows={3}
          value={comment}
          onChange={(e) => onCommentChange(e.target.value)}
          variant="outlined"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSubmit} variant="contained">
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
}
