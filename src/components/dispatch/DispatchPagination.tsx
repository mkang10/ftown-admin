import React from "react";
import { Box, Pagination } from "@mui/material";

interface DispatchPaginationProps {
  page: number;
  totalRecords: number;
  pageSize: number;
  onPageChange: (newPage: number) => void;
}

const DispatchPagination: React.FC<DispatchPaginationProps> = ({
  page,
  totalRecords,
  pageSize,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalRecords / pageSize);

  return (
    <Box display="flex" justifyContent="center" mt={2}>
      <Pagination
        count={totalPages}
        page={page}
        onChange={(_, newPage) => onPageChange(newPage)}
        color="primary"
        size="small"
      />
    </Box>
  );
};

export default DispatchPagination;
