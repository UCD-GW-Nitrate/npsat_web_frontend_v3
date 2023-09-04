import type { PaperProps } from '@mui/material';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import React from 'react';

import type { PlotModel } from '@/store/apis/feedApi';

export interface CoreTableColumn {
  label: string;
  width: number;
  field: string;
}

export interface CoreTableProps extends PaperProps {
  columns: CoreTableColumn[];
  data: any[];
  page: number;
  rowsPerPage: number;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const CoreTable = ({
  columns,
  data,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  sx,
  ...rest
}: CoreTableProps) => (
  <Paper {...rest} sx={{ ...sx, overflow: 'hidden' }}>
    <TableContainer>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {columns.map((column) => (
              <TableCell
                key={column.field}
                style={{ minWidth: column.width, backgroundColor: 'white' }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {(data ?? [])
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
      count={(data ?? []).length}
      rowsPerPage={rowsPerPage}
      page={page}
      onPageChange={handleChangePage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  </Paper>
);
