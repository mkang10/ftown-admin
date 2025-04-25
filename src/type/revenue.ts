export interface RevenueSummaryRequest {
    /** Thời điểm bắt đầu (ISO 8601) */
    from?: string;
    /** Thời điểm kết thúc (ISO 8601) */
    to?: string;
  }
  
  export interface RevenueSummary {
    totalRevenue: number;
    totalOrders: number;
    totalProductsSold: number;
  }
  
  export interface RevenueSummaryResponse {
    data: RevenueSummary;
    status: boolean;
    message: string;
  }
  