import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box } from '@mui/material';
import { Button, Select } from 'antd';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { CoreTable } from '@/components/core/CoreTable/CoreTable';
import Footer from '@/components/custom/Footer/Footer';
import { HBox } from '@/components/custom/HBox/Hbox';
import { StandardText } from '@/components/custom/StandardText/StandardText';
import { useScenarioGroups } from '@/hooks/useScenarioGroups';
import { useFetchFeedQuery } from '@/store';
import type { PlotModel } from '@/store/apis/feedApi';
import { selectCurrentUser } from '@/store/slices/authSlice';

import { COLUMNS } from './utility/constants';

const Homepage = () => {
  const { data, error, isFetching, refetch } = useFetchFeedQuery();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [fetchedOnce, setFetechedOnce] = useState(false);
  const [compareModels, setCompareModels] = useState<number[]>([]);
  const [displayData, setDisplayData] = useState<PlotModel[]>(
    data?.recentCompletedModels ?? [],
  );
  const router = useRouter();
  const user = useSelector(selectCurrentUser);

  const {
    flowScenarios: flowScenarioOptions,
    loadScenarios: loadScenarioOptions,
    unsatScenarios: unsatScenarioOptions,
    welltypeScenarios: welltypeScenarioOptions,
  } = useScenarioGroups();

  useEffect(() => {
    if (user && fetchedOnce) {
      refetch();
    }
  }, [user, fetchedOnce]);

  useEffect(() => {
    setDisplayData(data?.recentCompletedModels ?? []);
  }, [data]);

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

  const filterScenarios = (filter: string | undefined) => {
    if (filter) {
      const newData = (data?.recentCompletedModels ?? []).filter(
        (d) =>
          d.flowScenario === filter ||
          d.unsatScenario === filter ||
          d.wellTypeScenario === filter ||
          d.loadScenario === filter,
      );
      setDisplayData(newData);
    } else {
      setDisplayData(data?.recentCompletedModels ?? []);
    }
  };

  return (
    <>
      <HBox sx={{ mt: 2 }}>
        <StandardText variant="h1">Home</StandardText>
        <Button
          type="primary"
          size="large"
          onClick={() => router.push('/model/create')}
        >
          Create Scenario
        </Button>
      </HBox>
      <HBox spacing={1} sx={{ mt: 2 }}>
        <StandardText variant="body1">Scenario Type:</StandardText>
        <Select
          showSearch
          placeholder="Filter Scenarios"
          optionFilterProp="children"
          allowClear
          style={{ width: 500 }}
          onChange={filterScenarios}
        >
          <Select.OptGroup label="Flow Scenario">
            {flowScenarioOptions.map((item) => (
              <Select.Option key={item.id} value={item.name}>
                {item.name}
              </Select.Option>
            ))}
          </Select.OptGroup>
          <Select.OptGroup label="Load Scenario">
            {loadScenarioOptions.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select.OptGroup>
          <Select.OptGroup label="Unsat Scenario">
            {unsatScenarioOptions.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select.OptGroup>
          <Select.OptGroup label="Well Type Scenario">
            {welltypeScenarioOptions.map((item) => (
              <Select.Option key={item.id} value={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select.OptGroup>
        </Select>
      </HBox>
      <Box
        sx={{
          px: 2,
          backgroundColor: 'rgba(100,149,237, 0.2)',
          borderRadius: 1,
          mt: 3,
        }}
      >
        <HBox>
          <HBox spacing={1}>
            <InfoOutlinedIcon color="primary" sx={{ py: 2 }} />
            You may select two or more models to compare. Maximum of 5.
          </HBox>
          <Button
            disabled={compareModels.length <= 1 || compareModels.length > 5}
            onClick={() =>
              router.push({
                pathname: '/model/compare',
                query: {
                  models: compareModels,
                },
              })
            }
          >
            Create Scenario
          </Button>
        </HBox>
      </Box>
      <CoreTable
        columns={COLUMNS}
        data={displayData}
        rowsPerPage={rowsPerPage}
        page={page}
        handleChangePage={handleChangePage}
        handleChangeRowsPerPage={handleChangeRowsPerPage}
        sx={{ mt: 4 }}
        checkboxSelection
        onCheckboxSelection={setCompareModels}
      />
      <Box sx={{ mt: 30 }} />
      <Footer />
    </>
  );
};

export default Homepage;
