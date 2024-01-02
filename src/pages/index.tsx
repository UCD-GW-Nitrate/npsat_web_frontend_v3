import { Box } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { CoreButton } from '@/components/core/CoreButton/CoreButton';
import { CoreMenuButton } from '@/components/core/CoreMenuButton/CoreMenuButton';
import { CoreMultipleSelect } from '@/components/core/CoreMultipleSelect/CoreMultipleSelect';
import { CoreTable } from '@/components/core/CoreTable/CoreTable';
import { CoreText } from '@/components/core/CoreText/CoreText';
import Footer from '@/components/custom/Footer/Footer';
import { HBox } from '@/components/custom/HBox/Hbox';
import Layout from '@/components/custom/Layout/Layout';
import { useFetchFeedQuery } from '@/store';
import { selectCurrentUser } from '@/store/slices/authSlice';

import {
  COLUMNS,
  COMPARE_SCENARIO_OPTIONS,
  FILTER_OPTIONS,
} from './utility/constants';

const Index = () => {
  const { data, error, isFetching, refetch } = useFetchFeedQuery();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [fetchedOnce, setFetechedOnce] = useState(false);
  const router = useRouter();
  const user = useSelector(selectCurrentUser);

  useEffect(() => {
    if (user && fetchedOnce) {
      refetch();
    }
  }, [user, fetchedOnce]);

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
    if (!fetchedOnce) {
      setFetechedOnce(true);
    }
  } else if (error) {
    console.log(error);
    return <Box />;
  }

  return (
    <Layout>
      <HBox sx={{ mt: 4 }}>
        <CoreText variant="h1">Home</CoreText>
        <HBox spacing={2}>
          <CoreMenuButton
            label="Compare Scenario"
            variant="outlined"
            options={COMPARE_SCENARIO_OPTIONS}
          />
          <CoreButton
            label="Create Scenario"
            variant="contained"
            onClick={() => {
              router.push('/model/create');
            }}
          />
        </HBox>
      </HBox>
      <HBox spacing={1} sx={{ mt: 4 }}>
        <CoreText variant="body1">Scenario Type:</CoreText>
        <CoreMultipleSelect
          options={FILTER_OPTIONS}
          sx={{ minWidth: 600 }}
          placeholder="Filter Scenarios"
          group
        />
      </HBox>
      <CoreTable
        columns={COLUMNS}
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
