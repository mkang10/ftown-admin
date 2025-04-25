"use client";
import React from 'react';
import { Card, Box, Typography } from '@mui/material';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export type StatusCount = { status: string; count: number };

interface StatusPieChartProps {
  title: string;
  data: StatusCount[];
  colors?: string[];
}

const StatusPieChart: React.FC<StatusPieChartProps> = ({ title, data, colors }) => {
  const defaultColors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];
  const palette = colors || defaultColors;

  // Render chart only on client
  if (typeof window === 'undefined') return null;

  return (
    <Card sx={{ p: 2 }}>
      <Typography variant="h6" fontWeight="bold" mb={2}>
        {title}
      </Typography>
      <Box sx={{ height: 250 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              label
            >
              {data.map((entry, idx) => (
                <Cell key={entry.status} fill={palette[idx % palette.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      </Box>
    </Card>
  );
};

export default StatusPieChart;