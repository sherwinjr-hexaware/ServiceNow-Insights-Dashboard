import React from 'react';
import { Box, Paper, Skeleton, Typography } from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';

interface TopCallersTableProps {
  data: { name: string; value: number }[];
  loading: boolean;
}

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Caller', flex: 1 },
  { field: 'value', headerName: 'Incidents', type: 'number', flex: 0.5 },
];

const TopCallersTable: React.FC<TopCallersTableProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <Paper elevation={1} sx={{ p: 2, height: 300 }}>
        <Skeleton variant="text" width="60%" height={40} />
        <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
      </Paper>
    );
  }

  // Add a unique id to each row for DataGrid
  const rows = data.map((item, index) => ({ id: index, ...item }));

  return (
    <Paper elevation={1} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Top 5 Monthly Callers
      </Typography>
      <Box sx={{ height: 300, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 5,
              },
            },
          }}
          pageSizeOptions={[5]}
          disableRowSelectionOnClick
        />
      </Box>
    </Paper>
  );
};

export default TopCallersTable;
