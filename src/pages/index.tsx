import { Box } from '@mui/material';
import React, { useState } from 'react';

import { CoreButton } from '@/components/core/CoreButton/CoreButton';
import { CoreMultipleSelect } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import type { CoreSelectOption } from '@/components/core/CoreSelect/CoreSelect';
import type { CoreTableColumn } from '@/components/core/CoreTable/CoreTable';
import { CoreTable } from '@/components/core/CoreTable/CoreTable';
import { CoreText } from '@/components/core/CoreText/CoreText';
import { HBox } from '@/components/HBox/Hbox';
import Layout from '@/components/Layout/Layout';
import { useFetchFeedQuery } from '@/store';

const columns: CoreTableColumn[] = [
  { field: 'name', label: 'Scenario Name', width: 200 },
  { field: 'description', label: 'Description', width: 200 },
  { field: 'status', label: 'Status', width: 100 },
  {
    field: 'dateCreated',
    label: 'Date Created',
    width: 150,
  },
  {
    field: 'dateCompleted',
    label: 'Date Completed',
    width: 150,
  },
  {
    field: 'types',
    label: 'Types',
    width: 150,
  },
];

const filterOptions: CoreSelectOption[] = [
  {
    label: 'C2Vsim',
  },
  {
    label: 'CVHM',
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
      <Box
        sx={{
          flexDirection: 'row',
          display: 'flex',
          mt: 4,
          justifyContent: 'space-between',
        }}
      >
        <CoreText variant="h1">Home</CoreText>
        <HBox spacing={2}>
          <CoreButton label="Compare Scenario" variant="outlined" />
          <CoreButton label="Create Scenario" variant="contained" />
        </HBox>
      </Box>
      <HBox spacing={1} sx={{ mt: 4 }}>
        <CoreText variant="body1">Scenario Type:</CoreText>
        <CoreMultipleSelect options={filterOptions} sx={{ minWidth: 500 }} />
      </HBox>
      <CoreTable
        columns={columns}
        data={data?.recentCompletedModels ?? []}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        sx={{ mt: 4 }}
      />
    </Layout>
  );
};

export default Index;
