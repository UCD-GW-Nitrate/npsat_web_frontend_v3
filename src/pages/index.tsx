import { Paper } from '@mui/material';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import type { GridColDef } from '@mui/x-data-grid';
import React, { useState } from 'react';

import Layout from '@/components/Layout/Layout';
import { useFetchFeedQuery } from '@/store';
import type { PlotModel } from '@/store/apis/feedApi';

const columns: GridColDef[] = [
  { field: 'name', headerName: 'Scenario Name', width: 200 },
  { field: 'description', headerName: 'Description', width: 200 },
  { field: 'status', headerName: 'Status', width: 100 },
  {
    field: 'dateCreated',
    headerName: 'Date Created',
    width: 150,
  },
  {
    field: 'dateCompleted',
    headerName: 'Date Completed',
    width: 150,
  },
  {
    field: 'types',
    headerName: 'Types',
    width: 150,
  },
];

const Index = () => {
  const { data, error, isFetching } = useFetchFeedQuery();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => {
    event?.preventDefault();
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  if (!isFetching) {
    console.log('log data');
    console.log(data);
  } else if (error) {
    console.log(error);
  }

  return (
    <Layout>
      <Paper sx={{ mx: 4, mt: 5, overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map((column) => (
                  <TableCell
                    key={column.field}
                    align={column.align}
                    style={{ minWidth: column.width, backgroundColor: 'white' }}
                  >
                    {column.headerName}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(data?.recentCompletedModels ?? [])
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => {
                  return (
                    <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                      {columns.map((column) => {
                        const value = row[column.field as keyof PlotModel];
                        return (
                          <TableCell key={column.field}>
                            {value as string}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </Layout>
  );
};

export default Index;
