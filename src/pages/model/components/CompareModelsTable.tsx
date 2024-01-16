import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';

import Scrollable from '@/components/custom/Scrollable/Scrollable';
import type { ModelDetail } from '@/store/apis/modelApi';

interface CompareModelsTableProps {
  data: ModelDetail[];
}

const CompareModelsTable = ({ data }: CompareModelsTableProps) => {
  console.log('compare models table:', data);
  const columns: ColumnsType<ModelDetail> = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'BAU',
      dataIndex: 'is_base',
      render: (value) => (value ? 'Yes' : 'No'),
    },
    {
      title: 'Description',
      dataIndex: 'description',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      render: (value: number) => {
        if (value === 0) {
          return 'Not ready';
        }
        if (value === 1) {
          return 'In queue';
        }
        if (value === 2) {
          return 'Running';
        }
        if (value === 3) {
          return 'Complete';
        }
        if (value === 4) {
          return 'Error';
        }
        return '';
      },
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
    },
    {
      title: 'Well Type Scenario',
      dataIndex: 'welltype_scenario',
      render: (v) => v.name,
    },
    {
      title: 'Regions',
      dataIndex: 'regions',
      render: (value) => value.map((regions: any) => regions.name).join(','),
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
    },
    {
      title: 'Date Completed',
      dataIndex: 'date_completed',
    },
  ];

  return (
    <Scrollable>
      <Table pagination={false} bordered columns={columns} dataSource={data} />
    </Scrollable>
  );
};

export default CompareModelsTable;
