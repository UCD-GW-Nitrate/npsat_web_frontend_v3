import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

import { CoreButton } from '@/components/core/CoreButton/CoreButton';
import { CoreMenuButton } from '@/components/core/CoreMenuButton/CoreMenuButton';
import type { CoreMultipleSelectOption } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import { CoreMultipleSelect } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import type { CoreTableColumn } from '@/components/core/CoreTable/CoreTable';
import { CoreTable } from '@/components/core/CoreTable/CoreTable';
import { CoreText } from '@/components/core/CoreText/CoreText';
import Footer from '@/components/custom/Footer/Footer';
import { HBox } from '@/components/custom/HBox/Hbox';
import Layout from '@/components/custom/Layout/Layout';
import { useFetchFeedQuery } from '@/store';

const columns: CoreTableColumn[] = [
  { field: 'name', label: 'Scenario Name', width: 150 },
  { field: 'description', label: 'Description', width: 300 },
  { field: 'flowScenario', label: 'Flow Scenario', width: 130 },
  { field: 'loadScenario', label: 'Load Scenario', width: 130 },
  { field: 'unsatScenario', label: 'Unsat Scenario', width: 150 },
  { field: 'wellTypeScenario', label: 'Well Type Scenario', width: 130 },
  { field: 'statusMessage', label: 'Status', width: 100 },
  { field: 'simEndYear', label: 'Year Range', width: 130 },
  {
    field: 'reductionStartYear',
    label: 'Implementation Start Year',
    width: 100,
  },
  {
    field: 'reductionEndYear',
    label: 'Implementation Complete Year',
    width: 100,
  },
  { field: 'waterContent', label: 'Water Content', width: 80 },
  {
    field: 'dateCreated',
    label: 'Date Created',
    width: 120,
  },
];

const filterOptions: CoreMultipleSelectOption[] = [
  {
    label: 'C2Vsim',
    group: 'Flow Scenario',
  },
  {
    label: 'CVHM',
    group: 'Flow Scenario',
  },
  {
    label: 'Baseline',
    group: 'Load Scenario',
  },
  {
    label: 'GNLM',
    group: 'Load Scenario',
  },
  {
    label: 'High Irrigation',
    group: 'Load Scenario',
  },
  {
    label: 'High Fertilization',
    group: 'Load Scenario',
  },
  {
    label: 'High Irrigation and High Fertilization',
    group: 'Load Scenario',
  },
  {
    label: 'Drought vadose zone thickness (spring 2015)',
    group: 'Unsat Scenario',
  },
  {
    label: 'Typical vadose zone thickness (spring 2000)',
    group: 'Unsat Scenario',
  },
  {
    label: 'Domestic Wells',
    group: 'Well Type Scenario',
  },
  {
    label: 'Public Supply and Irrigation Wells',
    group: 'Well Type Scenario',
  },
  {
    label:
      'Virtual Shallow Monitoring Well Network Grid (Currently Unavailable)',
    group: 'Well Type Scenario',
  },
];

const Index = () => {
  const { data, error, isFetching } = useFetchFeedQuery();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const router = useRouter();

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
          <CoreMenuButton
            label="Compare Scenario"
            variant="outlined"
            options={[
              {
                label: 'Compare with BAU',
              },
              {
                label: 'Compare with other scenarios',
              },
            ]}
          />
          <CoreButton
            label="Create Scenario"
            variant="contained"
            onClick={() => {
              router.push('/model/create');
            }}
          />
        </HBox>
      </Box>
      <HBox spacing={1} sx={{ mt: 4 }}>
        <CoreText variant="body1">Scenario Type:</CoreText>
        <CoreMultipleSelect
          options={filterOptions}
          sx={{ minWidth: 600 }}
          placeholder="Filter Scenarios"
          group
        />
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
      <Box sx={{ mt: 30 }} />
      <Footer />
    </Layout>
  );
};

export default Index;
