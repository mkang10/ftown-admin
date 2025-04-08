// src/ultis/inventoryImportAPI.ts

import { ApiResponse } from "./apiResponse";
import { PageResult } from "./pageResult";

export interface InventoryImportItem {
  importId: number;
  createdBy: number;
  createdByName: string;
  createdDate: string;
  status: "Pending" | "Approved" | "Rejected"|"Processing" |"Done"|"Partial Success"|"Supplement Created";
  referenceNumber: string;
  totalCost: number;
  approvedDate: string | null;
  completedDate: string | null;
}

// Hàm approve inventory import
export interface ApproveRejectPayload {
  changedBy: number;
  comments: string;
}


export interface InventoryImportItem {
  importId: number;
  createdBy: number;
  createdByName: string;
  createdByEmail?: string;
  createdByPhone?: string;
  createdByAddress?: string;
  createdDate: string;
  status: "Pending" | "Approved" | "Rejected" | "Processing" |"Done"|"Partial Success"|"Supplement Created";
  referenceNumber: string;
  totalCost: number;
  approvedDate: string | null;
  completedDate: string | null;
}

export type PendingInventoryResponse = ApiResponse<InventoryImportItem[]>;
export type ApproveRejectResponse = ApiResponse<[ApproveRejectPayload]>;
export type FilterInventoryResponse = ApiResponse<PageResult<InventoryImportItem>>;


