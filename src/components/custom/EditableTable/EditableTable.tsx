'use client';

import { useGetModelStatusQuery } from '@/store';
import type { TableProps } from 'antd';
import { Form, Input, Table, Typography } from 'antd';
import type { GetRowKey, TableRowSelection } from 'antd/es/table/interface';
import type { AnyObject } from 'immer/dist/internal';
import { useEffect, useState } from 'react';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  isEditable?: boolean;
  dataIndex: string;
  title: any;
  inputType: 'select' | 'text';
  record: any;
  index: number;
}

// define component used to render each cell (of table body)
const EditableCell: React.FC<React.PropsWithChildren<EditableCellProps>> = ({
  editing,
  isEditable = false,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item name={dataIndex} style={{ margin: 0 }}>
          <Input defaultValue={record[dataIndex]} />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

function EditableTable<T extends AnyObject>({
  columns,
  dataSource,
  footer,
  updateCallback,
  deleteCallback,
  scroll,
  rowSelection,
  rowKey,
  onRow,
  pendingModelIds,
}: {
  columns: any[];
  dataSource: T[];
  footer?: any;
  scroll?: {
    x?: number | true | string;
    y?: number | string;
  } & {
    scrollToFirstRowOnChange?: boolean;
  };
  rowSelection?: TableRowSelection<T>;
  rowKey?: string | GetRowKey<T>;
  onRow?: (record: T) => any;
  updateCallback?: (data: Partial<T>) => Promise<void>;
  deleteCallback?: (id: number) => Promise<void>;
  pendingModelIds: number[];
}) {
  const [ids, setIds] = useState<number[]>(pendingModelIds)
  const [latestData, setLatestData] = useState<T[]>(dataSource)
  const { data } = useGetModelStatusQuery(
    { ids },
    {
      pollingInterval: ids.length > 0 ? 1000 : 0,
      skip: ids.length === 0,
      refetchOnMountOrArgChange: true,
    },
  );
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<number>(0);

   useEffect(()=>{
    if (data) {
      data.results.forEach(statusObj => {
        const modelId = statusObj.id;
        const status = statusObj.status;
        const idx = pendingModelIds.indexOf(modelId)
        setLatestData((prev)=>{
          const newArray = [...prev]
          if (newArray[idx]) {
            newArray[idx] = {...newArray[idx], status}
          }
          return newArray
        })
        if (ids.includes(modelId) && status>2) {
          setIds((prev)=>{
            const newArray = [...prev]
            newArray.splice(newArray.indexOf(modelId), 1)
            return newArray
          })
        }
      })
    }
  }, [data])

  useEffect(() => {
    setIds(pendingModelIds);
  }, [pendingModelIds]);

  useEffect(() => {
    setLatestData(dataSource);
  }, [dataSource]);


  const isEditing = (record: T) => record.id === editingKey;

  const edit = (record: Partial<T>) => {
    form.setFieldsValue({
      name: record.name ?? '',
      program: record.programId ?? 0,
    });
    setEditingKey(record.id!);
  };

  const cancel = () => {
    setEditingKey(0);
  };

  const save = async (id: number) => {
    try {
      const row = (await form.validateFields()) as Partial<T>;
      if (updateCallback) {
        await updateCallback({ ...row, id });
      }
      setEditingKey(0);
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const deleteModel = async (id: number) => {
    try {
      if (deleteCallback) {
        await deleteCallback(id);
      }
    } catch (errInfo) {
      console.log('Delete Failed:', errInfo);
    }
  };

  const editableColumns = [
    ...columns,
    {
      title: 'Actions',
      dataIndex: 'actions',
      width: 150,
      fixed: 'right',
      render: (_: any, record: T & { id: number }) => {
        const editable = isEditing(record);

        console.log('editable', editable, record.id, editingKey);

        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.id)}
              style={{ marginRight: 8 }}
            >
              Save
            </Typography.Link>
            <Typography.Link onClick={() => cancel()}>Cancel</Typography.Link>
          </span>
        ) : (
          <span>
            <Typography.Link
              style={{ marginRight: 8 }}
              onClick={(event) => {
                event.stopPropagation();
                edit(record);
              }}
              disabled={record.status<3}
            >
              Edit
            </Typography.Link>
            <Typography.Link
              onClick={(event) => {
                event.stopPropagation();
                deleteModel(record.id);
              }}
              disabled={record.status<3}
            >
              Delete
            </Typography.Link>
          </span>
        );
      },
    },
  ];

  const mergedColumns: TableProps<T>['columns'] = editableColumns.map(
    (col: any) => {
      if (col.dataIndex === 'actions') {
        return col;
      }
      return {
        ...col,
        onCell: (record: T) => ({
          record,
          inputType: 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: isEditing(record) && (col.isEditable ?? false),
          isEditable: col.isEditable,
        }),
      };
    },
  );

  const rowClicked = (record: T) => {
    if (editingKey === 0 && onRow) {
      return onRow(record);
    }
    return null;
  };

  return (
    <Form form={form}>
      <Table
        components={{
          body: {
            cell: EditableCell,
          },
        }}
        columns={mergedColumns}
        dataSource={latestData}
        footer={footer}
        scroll={scroll}
        rowSelection={rowSelection}
        rowKey={rowKey}
        onRow={rowClicked}
        rowClassName={(record) => {
          if (record.status !== 3) return 'row-disabled';
          return '';
        }}
      />
    </Form>
  );
}

export default EditableTable;
