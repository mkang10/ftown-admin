import React from 'react';
import {
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  TextField,
  CircularProgress,
  Grow,
} from '@mui/material';

interface FilterBarProps {
  statusOptions: string[];
  statusFilter: string;
  onStatusChange: (value: string) => void;
  fromDate: string;
  onFromChange: (value: string) => void;
  toDate: string;
  onToChange: (value: string) => void;
  loading: boolean;
}

const FilterBar: React.FC<FilterBarProps> = ({
  statusOptions,
  statusFilter,
  onStatusChange,
  fromDate,
  onFromChange,
  toDate,
  onToChange,
  loading,
}) => (
  <Grow in>
    <Paper
      elevation={3}
      sx={{
        p: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexWrap: 'wrap',
        gap: 2,
        mb: 4,
        borderRadius: 2,
      }}
    >
      <FormControl sx={{ minWidth: 200 }} disabled={loading}>
        <InputLabel id="status-filter-label">Chọn trạng thái</InputLabel>
        <Select
          labelId="status-filter-label"
          value={statusFilter}
          label="Chọn trạng thái"
          onChange={(e) => onStatusChange(e.target.value)}
          renderValue={(selected) =>
            selected ? <Chip label={selected} size="small" /> : <em>Tất cả</em>
          }
        >
          <MenuItem value="">
            <em>Tất cả</em>
          </MenuItem>
          {statusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        type="datetime-local"
        label="Từ ngày"
        value={fromDate}
        onChange={(e) => onFromChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        disabled={loading}
      />
      <TextField
        type="datetime-local"
        label="Đến ngày"
        value={toDate}
        onChange={(e) => onToChange(e.target.value)}
        InputLabelProps={{ shrink: true }}
        disabled={loading}
      />

      {loading && <CircularProgress size={24} sx={{ ml: 2 }} />}
    </Paper>
  </Grow>
);

export default FilterBar;