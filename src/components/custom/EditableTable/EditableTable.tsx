'use client';

import { useGetModelStatusQuery } from '@/store';
import { MODEL_STATUS_MACROS } from '@/utils/constants';
import { CheckCircleFilled, CloseCircleFilled, CloseCircleTwoTone } from '@ant-design/icons';
import type { TableProps } from 'antd';
import { Form, Input, Table, Tooltip, Typography } from 'antd';
import type { GetRowKey, TableRowSelection } from 'antd/es/table/interface';
import type { AnyObject } from 'immer/dist/internal';
import { useEffect, useState } from 'react';

import './styles.css';

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

  useEffect(() => {
    setIds(pendingModelIds);
  }, [pendingModelIds]);

  useEffect(() => {
    setLatestData(dataSource);
  }, [dataSource]);


  useEffect(()=>{
    if (data) {
      data.results.forEach(statusObj => {
        const modelId = statusObj.id;
        const status = statusObj.status;

        setLatestData(prev => 
          prev.map(row =>
            row.id === modelId ? { ...row, status: status } : row
          )
        );

        console.log("Checking ", ids)

        if (ids.includes(modelId) && status>2) {
          setIds(prev => {
            const newArray = [...prev]
            newArray.splice(newArray.indexOf(modelId), 1)
            return newArray
          })
          if (status==MODEL_STATUS_MACROS.COMPLETED) showNewStatus(modelId)
        }
      })
    }
  }, [data])


  const showNewStatus = (modelId: number) => {
    setLatestData(prev =>
      prev.map(row =>
        row.id === modelId ? { ...row, status: 5 } : row
      )
    );

    setTimeout(() => {
      setLatestData(prev =>
        prev.map(row =>
          row.id === modelId ? { ...row, status: MODEL_STATUS_MACROS.COMPLETED } : row
        )
      );
    }, 5000);
  };


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
              disabled={record.status !== MODEL_STATUS_MACROS.COMPLETED}
            >
              Edit
            </Typography.Link>
            <Typography.Link
              onClick={(event) => {
                event.stopPropagation();
                deleteModel(record.id);
              }}
              disabled={record.status !== MODEL_STATUS_MACROS.COMPLETED}
            >
              Delete
            </Typography.Link>
          </span>
        );
      },
    },
  ];

  const customRowSelection: TableRowSelection<T> = {
    ...rowSelection,
    getCheckboxProps: (record) => ({
      disabled: record.status !== 3,
    }),
    renderCell: (_checked, record, _index, originNode) => {
      if (record.status === MODEL_STATUS_MACROS.READY) {
        return (
          <Tooltip title="Model Queued">
            <CloseCircleTwoTone twoToneColor={['#E5E5BF', '#E5E5BF']} style={{ fontSize: 15 }} />
          </Tooltip>
        )
      } else if (record.status === MODEL_STATUS_MACROS.RUNNING) {
        return (
          <Tooltip title="Running">
            <CloseCircleTwoTone twoToneColor={['#FDDA0D', '#FDDA0D']} style={{ fontSize: 15 }} />
          </Tooltip>
        )
      } else if (record.status === MODEL_STATUS_MACROS.ERROR) {
        return (
          <Tooltip title="Run Failed">
            <CloseCircleFilled style={{ fontSize: 15, color: "#ff4d4f" }} />
          </Tooltip>
        )
      } else if (record.status === 5) {
        return (
          <Tooltip title="Run Completed">
            <div className="icon-grow">
              <CheckCircleFilled style={{ fontSize: 15, color: "#52c41a" }} />
            </div>
          </Tooltip>
        )
      }
      return originNode;
    },
  };


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
        rowSelection={customRowSelection}
        rowKey={rowKey}
        onRow={rowClicked}
        rowClassName={(record) => {
          if (record.status !== MODEL_STATUS_MACROS.COMPLETED) return 'row-disabled';
          return '';
        }}
      />
    </Form>
  );
}

export default EditableTable;
