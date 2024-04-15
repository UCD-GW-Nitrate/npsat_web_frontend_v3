import { InfoCircleOutlined } from '@ant-design/icons';
import { Box } from '@mui/material';
import { Button, Select, Table } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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
  const [fetchedOnce, setFetechedOnce] = useState(false);
  const [displayData, setDisplayData] = useState<PlotModel[]>(
    data?.recentCompletedModels ?? [],
  );
  const router = useRouter();
  const user = useSelector(selectCurrentUser);
  const [selected, setSelected] = useState<number[]>([]);

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

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelected(newSelectedRowKeys.map((key) => parseInt(`${key}`, 10)));
  };

  const rowSelection: TableRowSelection<PlotModel> = {
    selectedRowKeys: selected,
    onChange: onSelectChange,
  };

  return (
    <>
      <HBox>
        <StandardText variant="h1" style={{ marginTop: 10 }}>
          Home
        </StandardText>
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
            <InfoCircleOutlined />
            You may select two or more models to compare. Maximum of 5.
          </HBox>
          <Button
            disabled={selected.length <= 1 || selected.length > 5}
            style={{ marginTop: 10, marginBottom: 10 }}
            onClick={() =>
              router.push({
                pathname: '/model/compare',
                query: {
                  models: selected,
                },
              })
            }
          >
            Compare Scenario
          </Button>
        </HBox>
      </Box>
      <Table
        scroll={{ x: 'max-content' }}
        rowSelection={rowSelection}
        columns={COLUMNS}
        dataSource={displayData}
        rowKey={(model) => model.id}
        style={{ marginTop: 30 }}
        onRow={(record) => {
          return {
            onClick: () => {
              router.push({
                pathname: `/model/`,
                query: { id: record.id },
              });
            },
          };
        }}
      />
      <Box sx={{ mt: 30 }} />
      <Footer />
    </>
  );
};

export default Homepage;
