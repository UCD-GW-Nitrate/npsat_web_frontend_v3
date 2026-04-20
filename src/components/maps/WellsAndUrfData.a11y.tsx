'use client';

import type { TableColumnsType } from 'antd';
import { Table } from 'antd';

import type { UrfData } from '@/types/well/WellExplorer';

export interface WellsAndUrfDataProps {
  urfData: UrfData[];
}

const columns: TableColumnsType<UrfData> = [
  {
    title: 'Coordinates',
    dataIndex: 'lat',
    render: (_, record) => (
      <p>
        Lat {record.lat}, Long {record.lon}
      </p>
    ),
  },
];

export default function AccessibleWellsAndUrfData({
  urfData,
}: WellsAndUrfDataProps) {
  return <Table<UrfData> columns={columns} dataSource={urfData} />;
}
