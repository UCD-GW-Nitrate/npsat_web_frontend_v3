import type { PaperProps } from '@mui/material';
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
} from '@mui/material';
import { useRouter } from 'next/router';
import type { UIEvent } from 'react';
import React, { useState } from 'react';

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
}: CoreTableProps) => {
  const [left, setLeft] = useState(true);
  const [right, setRight] = useState(false);
  const router = useRouter();

  const handleScroll = (e: UIEvent<HTMLElement>) => {
    const isRight =
      e.currentTarget.scrollWidth - e.currentTarget.scrollLeft ===
      e.currentTarget.clientWidth;
    const isLeft =
      e.currentTarget.scrollWidth - e.currentTarget.scrollLeft ===
      e.currentTarget.scrollWidth;

    if (isRight && !right) {
      setRight(true);
    } else if (right) {
      setRight(false);
    }
    if (isLeft && !left) {
      setLeft(true);
    } else if (left) {
      setLeft(false);
    }
  };

  return (
    <Paper {...rest} sx={{ ...sx, overflowX: 'hidden' }}>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            boxShadow: `15px 0 12px -12px ${
              !left ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)'
            } inset`,
            position: 'absolute',
            top: 0,
            bottom: 0,
            width: 30,
            zIndex: 99,
            transition: 'box-shadow .3s',
          }}
        />
        <div
          style={{
            boxShadow: `-15px 0 12px -12px ${
              !right ? 'rgba(0,0,0,0.4)' : 'rgba(0,0,0,0)'
            } inset`,
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            width: 30,
            zIndex: 99,
            transition: 'box-shadow 0.3s',
          }}
        />
        <div
          style={{
            overflowX: 'scroll',
          }}
          onScroll={handleScroll}
        >
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
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.id}
                      onClick={() =>
                        router.push({
                          pathname: `/model/`,
                          query: { id: row.id },
                        })
                      }
                    >
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
        </div>
      </div>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={(data ?? []).length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        sx={{ overflow: 'fixed' }}
      />
    </Paper>
  );
};
