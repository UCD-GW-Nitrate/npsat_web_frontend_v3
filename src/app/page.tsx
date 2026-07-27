'use client';

import { InfoCircleOutlined } from '@ant-design/icons';
import type { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query';
import { Button, Select } from 'antd';
import type { TableRowSelection } from 'antd/es/table/interface';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import AppLayout from '@/components/custom/AppLayout/AppLayout';
import Disclaimer from '@/components/custom/Disclaimer/Disclaimer';
import EditableTable from '@/components/custom/EditableTable/EditableTable';
import { HBox } from '@/components/custom/HBox/Hbox';
import { StandardText } from '@/components/custom/StandardText/StandardText';
import { VBox } from '@/components/custom/VBox/VBox';
import { useScenarioGroups } from '@/hooks/useScenarioGroups';
import {
  useDeleteModelMutation,
  useFetchFeedQuery,
  useGetPaginatedModelRunsQuery,
  usePatchModelMutation,
} from '@/store';
import {
  useGetUserPreferencesQuery,
  useUpdateUserPreferencesMutation,
} from '@/store/apis/userApi';
import { clearModel } from '@/store/slices/modelSlice';
import type { PlotModel } from '@/types/feed/Feed';

import { COLUMNS } from '../utils/constants';

const Index = () => {
  const { data, error, refetch, isFetching } = useFetchFeedQuery();
  const [patchModel] = usePatchModelMutation();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [scenarioFilter, setScenarioFilter] = useState<number | null>(null);
  const { data: userPreferences } = useGetUserPreferencesQuery();
  const [updateUserPreferences] = useUpdateUserPreferencesMutation();
  const { data: paginatedModelRuns, refetch: refetchModelRuns } =
    useGetPaginatedModelRunsQuery({
      limit: pageSize,
      offset: (page - 1) * pageSize,
      scenarios: scenarioFilter,
    });
  const [pendingModelIds, setPendingModelIds] = useState<number[]>(
    data?.pending_model_ids ?? [],
  );
  const [selected, setSelected] = useState<number[]>([]);
  const router = useRouter();
  const dispatch = useDispatch();
  const [hydrated, setHydrated] = useState(false);

  const {
    flowScenarios: flowScenarioOptions,
    loadScenarios: loadScenarioOptions,
    unsatScenarios: unsatScenarioOptions,
    welltypeScenarios: welltypeScenarioOptions,
  } = useScenarioGroups();

  useEffect(() => {
    setPendingModelIds(data?.pending_model_ids ?? pendingModelIds);
  }, [data]);

  useEffect(() => {
    if (userPreferences?.feed_size) {
      setPageSize(userPreferences.feed_size);
    }
  }, [userPreferences]);

  useEffect(() => {
    dispatch(clearModel());
    refetch();
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (error && hydrated && !isFetching) {
      console.log('error', error);
      const e = error as FetchBaseQueryError;
      if (e && e.status === 401) {
        router.push('/user/login');
      }
    }
  }, [hydrated, isFetching]);

  const handleFilterChange = (scenarioId: number | null) => {
    setScenarioFilter(scenarioId);
    setPage(1);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelected(newSelectedRowKeys.map((key) => parseInt(`${key}`, 10)));
  };

  const rowSelection: TableRowSelection<PlotModel> = {
    selectedRowKeys: selected,
    onChange: onSelectChange,
  };

  const [deleteModel] = useDeleteModelMutation();

  return (
    <AppLayout>
      <Disclaimer />
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
      <VBox spacing="large" style={{ marginTop: 20 }}>
        <HBox spacing="small">
          <StandardText variant="body1">Scenario Type:</StandardText>
          <Select
            showSearch
            placeholder="Filter Scenarios"
            optionFilterProp="children"
            allowClear
            style={{ width: 500 }}
            onChange={handleFilterChange}
          >
            <Select.OptGroup label="Flow Scenario">
              {flowScenarioOptions.map((item) => (
                <Select.Option key={item.id} value={item.id}>
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
        <HBox
          style={{
            padding: 10,
            backgroundColor: 'rgba(100,149,237, 0.2)',
            borderRadius: 8,
          }}
        >
          <HBox spacing="small">
            <InfoCircleOutlined />
            You may select two or more models to compare. Maximum of 32.
          </HBox>
          <Button
            disabled={selected.length <= 1 || selected.length > 32}
            onClick={() =>
              router.push(`/model/compare/?models=${selected.join('&models=')}`)
            }
          >
            Compare Scenarios
          </Button>
        </HBox>
        <EditableTable<PlotModel>
          scroll={{ x: 'max-content' }}
          rowSelection={rowSelection}
          columns={COLUMNS}
          dataSource={paginatedModelRuns?.results ?? []}
          rowKey={(model) => model.id}
          updateCallback={async (m) => {
            await patchModel({
              id: m.id,
              name: m.name,
              description: m.description,
            });
            await refetch();
            await refetchModelRuns();
          }}
          deleteCallback={async (id) => {
            await deleteModel(id);
            await refetch();
            await refetchModelRuns();
          }}
          onRow={(record) => {
            return {
              onClick: () => {
                router.push(`/model/?id=${record.id}`);
              },
            };
          }}
          pendingModelIds={pendingModelIds}
          pagination={{
            current: page,
            pageSize,
            total: paginatedModelRuns?.count ?? 0,
            onChange: (newPage, newPageSize) => {
              if (newPageSize !== pageSize) {
                updateUserPreferences({ feed_size: newPageSize });
                setPageSize(newPageSize);
                setPage(1);
              } else {
                setPage(newPage);
              }
            },
          }}
        />
      </VBox>
    </AppLayout>
  );
};

export default Index;
