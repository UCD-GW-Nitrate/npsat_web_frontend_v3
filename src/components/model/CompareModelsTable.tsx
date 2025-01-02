import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import type { ModelRun } from '@/types/model/ModelRun';

interface CompareModelsTableProps {
  data: ModelRun[];
}

const CompareModelsTable = ({ data }: CompareModelsTableProps) => {
  const columns: ColumnsType<ModelRun> = [
    {
      title: 'Name',
      dataIndex: 'name',
      width: 400,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      width: 400,
    },
    {
      title: 'Flow Scenario',
      dataIndex: 'flow_scenario',
      render: (v) => v.name,
    },
    {
      title: 'Load Scenario',
      dataIndex: 'load_scenario',
      render: (v) => v.name,
    },
    {
      title: 'Unsat Scenario',
      dataIndex: 'unsat_scenario',
      render: (v) => v.name,
      width: 500,
    },
    {
      title: 'Well Type Scenario',
      dataIndex: 'welltype_scenario',
      render: (v) => v.name,
      width: 200,
    },
    {
      title: 'Regions',
      dataIndex: 'regions',
      render: (value) => value.map((regions: any) => regions.name).join(','),
      width: 200,
    },
    {
      title: 'Wells Included',
      dataIndex: 'n_wells',
      render: (value) => value || 'Not completed',
    },
    {
      title: 'Year range',
      dataIndex: 'sim_end_year',
      render: (value) => `1945 - ${value}`,
      width: 250,
    },
    {
      title: 'Implementation Start Year',
      dataIndex: 'reduction_start_year',
    },
    {
      title: 'Implementation Complete Year',
      dataIndex: 'reduction_end_year',
    },
    {
      title: 'Water Content',
      dataIndex: 'water_content',
      render: (value) => `${(value * 100).toFixed(0)}%`,
    },
    {
      title: 'Porosity',
      dataIndex: 'porosity',
      render: (value) => `${value}%`,
    },
    {
      title: 'Date Created',
      dataIndex: 'date_submitted',
      render: (value: string) => {
        const date = new Date(value);
        return date.toISOString().substring(0, 10);
      },
      width: 250,
    },
    {
      title: 'Simulator Version',
      dataIndex: 'mantis_version',
    },
  ];

  return (
    <Table
      pagination={false}
      bordered
      columns={columns}
      dataSource={data}
      scroll={{ x: 'max-content' }}
    />
  );
};

export default CompareModelsTable;
