export interface StatusCount {
    status: string;
    count: number;
  }
  
  export interface DashboardData {
    importStatusCounts: StatusCount[];
    dispatchStatusCounts: StatusCount[];
    transferStatusCounts: StatusCount[];
    totalImports: number;
    totalImportCost: number;
    totalDispatches: number;
    totalTransfers: number;
  }
  
  export interface DashboardResponse {
    data: DashboardData;
    status: boolean;
    message: string;
  }