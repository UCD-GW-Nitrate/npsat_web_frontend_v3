import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import Scrollable from '@/components/custom/Scrollable/Scrollable';
import type { ModelDetail } from '@/store/apis/modelApi';

interface CompareModelsTableProps {
  data: ModelDetail[];
}

const CompareModelsTable = ({ data }: CompareModelsTableProps) => {
  const columns: ColumnsType<ModelDetail> = [
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
      title: 'Wells included',
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
      title: 'Implementation start year',
      dataIndex: 'reduction_start_year',
    },
    {
      title: 'Implementation complete year',
      dataIndex: 'reduction_end_year',
    },
    {
      title: 'Water content',
      dataIndex: 'water_content',
      render: (value) => `${(value * 100).toFixed(0)}%`,
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
  ];

  return (
    <Scrollable>
      <Table pagination={false} bordered columns={columns} dataSource={data} />
    </Scrollable>
  );
};

export default CompareModelsTable;
