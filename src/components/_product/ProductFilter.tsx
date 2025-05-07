import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  Grid,
  TextField,
  Select,
  MenuItem,
  IconButton,
  Collapse,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';

interface ProductFilterProps {
  filters: Record<string, any>;
  onChange: (key: string, value: any) => void;
}

export const ProductFilter: React.FC<ProductFilterProps> = ({ filters, onChange }) => {
    const [open, setOpen] = useState(false);
    const [debouncedName, setDebouncedName] = useState(filters.name || '');
  
    useEffect(() => {
      const timer = setTimeout(() => {
        onChange('name', debouncedName);
      }, 500);
      return () => clearTimeout(timer);
    }, [debouncedName]);
  
    const handleImmediateChange = (key: string, value: any) => {
      onChange(key, value);
    };
  
    return (
      <>
        <IconButton onClick={() => setOpen(!open)} aria-label="filter">
          <FilterListIcon />
        </IconButton>
        <Collapse in={open} timeout="auto" unmountOnExit>
          <Card sx={{ mb: 2, p: 2 }} elevation={1}>
            <CardContent sx={{ pb: 1 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6} md={4}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Name"
                    value={debouncedName}
                    onChange={e => setDebouncedName(e.target.value)}
                  />
                </Grid>
                {['description', 'origin', 'model', 'occasion', 'style', 'material', 'skuFilter'].map(key => (
                  <Grid item xs={12} sm={6} md={4} key={key}>
                    <TextField
                      fullWidth
                      size="small"
                      label={key.charAt(0).toUpperCase() + key.slice(1)}
                      value={filters[key] || ''}
                      onChange={e => handleImmediateChange(key, e.target.value)}
                    />
                  </Grid>
                ))}
                <Grid item xs={12} sm={6} md={4}>
                  <Select
                    fullWidth
                    size="small"
                    displayEmpty
                    value={filters.status || ''}
                    onChange={e => handleImmediateChange('status', e.target.value)}
                  >
                    <MenuItem value="">
                      <em>Trạng thái</em>
                    </MenuItem>
                    <MenuItem value="Draft">Draft</MenuItem>
                    <MenuItem value="Offline">Offline</MenuItem>
                    <MenuItem value="Online">Online</MenuItem>
                    <MenuItem value="Both">Both</MenuItem>

                  </Select>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Collapse>
      </>
    );
  };
  