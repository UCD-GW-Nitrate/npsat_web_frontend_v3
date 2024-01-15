import type { PaperProps } from '@mui/material';
import {
  Checkbox,
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

import { CoreContainer } from '../CoreContainer/CoreContainer';

export interface CoreTableColumn {
  label: string;
  width: number;
  field: string;
}

export interface CoreTableProps extends PaperProps {
  columns: CoreTableColumn[];
  data: PlotModel[];
  page: number;
  rowsPerPage: number;
  handleChangePage: (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    newPage: number,
  ) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  checkboxSelection?: boolean;
  onCheckboxSelection?: (selected: number[]) => void;
}

export const CoreTable = ({
  columns,
  data,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  sx,
  checkboxSelection = false,
  onCheckboxSelection,
  ...rest
}: CoreTableProps) => {
  const [selected, setSelected] = useState<number[]>([]);
  const [left, setLeft] = useState(true);
  const [right, setRight] = useState(false);
  const router = useRouter();

  const isSelected = (id: number) => {
    for (let i = 0; i < selected.length; i += 1) {
      if (selected[i] === id) {
        return true;
      }
    }
    return false;
  };

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

  const handleCheckboxClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    id: number,
  ) => {
    event.stopPropagation();
    const selectedIndex = selected.indexOf(id);
    let newSelected: number[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
    if (onCheckboxSelection) {
      onCheckboxSelection(newSelected);
    }
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(data.map((row) => row.id));
    } else {
      setSelected([]);
    }
  };

  return (
    <CoreContainer {...rest} sx={{ ...sx, overflowX: 'hidden', p: 0 }}>
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
                {checkboxSelection && (
                  <TableCell>
                    <Checkbox
                      indeterminate={
                        selected.length > 0 && selected.length < data.length
                      }
                      checked={selected.length === data.length}
                      onChange={handleSelectAllClick}
                    />
                  </TableCell>
                )}
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
                      selected={isSelected(row.id)}
                    >
                      {checkboxSelection && (
                        <TableCell sx={{ py: 0 }}>
                          <Checkbox
                            onClick={(event) =>
                              handleCheckboxClick(event, row.id)
                            }
                            checked={isSelected(row.id)}
                          />
                        </TableCell>
                      )}
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
    </CoreContainer>
  );
};
