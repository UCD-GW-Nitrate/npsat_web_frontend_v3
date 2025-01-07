'use client';

import type { TableProps } from 'antd';
import { Form, Input, Table, Typography } from 'antd';
import type { GetRowKey, TableRowSelection } from 'antd/es/table/interface';
import type { AnyObject } from 'immer/dist/internal';
import { useState } from 'react';

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  isEditable?: boolean;
  dataIndex: string;
  title: any;
  inputType: 'select' | 'text';
  record: any;
  index: number;
}

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
}) {
  const [form] = Form.useForm();
  const [editingKey, setEditingKey] = useState<number>(0);

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
            >
              Edit
            </Typography.Link>
            <Typography.Link
              onClick={(event) => {
                event.stopPropagation();
                deleteModel(record.id);
              }}
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
        dataSource={dataSource}
        footer={footer}
        scroll={scroll}
        rowSelection={rowSelection}
        rowKey={rowKey}
        onRow={rowClicked}
      />
    </Form>
  );
}

export default EditableTable;
