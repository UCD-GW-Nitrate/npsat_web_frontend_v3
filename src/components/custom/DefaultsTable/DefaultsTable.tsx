import type { TableProps } from 'antd';
import { Table } from 'antd';
import React from 'react';

export interface DefaultsDataType {
  key: string;
  model: string;
  scenario: string;
  sac: number;
  sjv: number;
  tlb: number;
}

const columns: TableProps<DefaultsDataType>['columns'] = [
  {
    title: '',
    dataIndex: 'model',
    rowScope: 'row',
    colSpan: 2,
    width: 80,
    render: (_, record, index) => {
      const obj: any = {
        children: record.model,
        props: {},
      };

      // Merge 2 rows of C2VSIM
      if (index === 0) {
        obj.props.rowSpan = 2;
      }
      else if (index === 1) {
        obj.props.rowSpan = 0;
      }

      // Merge 2 rows of CVHM2
      else if (index === 2) {
        obj.props.rowSpan = 2;
      }
      else if (index === 3) {
        obj.props.rowSpan = 0;
      }

      return obj;
    },
  },
  {
    title: '',
    dataIndex: 'scenario',
    rowScope: 'row',
    colSpan: 0,
    width: 120,
  },
  {
    title: 'SAC',
    dataIndex: 'sac',
  },
  {
    title: 'SJV',
    dataIndex: 'sjv',
  },
  {
    title: 'TLB',
    dataIndex: 'tlb',
  },
];

export default function DefaultsTable({ data } : { data: DefaultsDataType[] }) {
  return (
    <Table<DefaultsDataType>
      columns={columns}
      dataSource={data}
      bordered
      pagination={false}
      size="small"
    />
  );
}
