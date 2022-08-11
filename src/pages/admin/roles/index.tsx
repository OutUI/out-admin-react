import { useState, useRef } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  message,
  Tag,
  Popconfirm,
  Space,
  Dropdown,
  Menu,
} from "antd";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import { useRequest } from "umi";

import {
  queryRole,
  updateRole,
  createRole,
  removeRole,
  showRole,
} from "@/services/admin/role";
import { queryPermission } from "@/services/admin/permission";
import type { RoleListItem } from "@/services/admin/role.d";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import ShowForm from "./components/ShowForm";
import type { SorterResult } from "antd/lib/table/interface";

/**
 * 添加
 * @param fields
 */
const handleCreate = async (fields: RoleListItem) => {
  const hide = message.loading("正在添加");
  try {
    await createRole({ ...fields });
    hide();
    message.success("添加成功");
    return true;
  } catch (error) {
    hide();
    message.error("添加失败请重试！");
    return false;
  }
};

/**
 * 更新
 * @param fields
 */
const handleUpdate = async (fields: RoleListItem) => {
  const hide = message.loading("正在更新");
  try {
    await updateRole({
      ...fields,
    });
    hide();
    message.success("更新成功");
    return true;
  } catch (error) {
    hide();
    message.error("更新失败请重试！");
    return false;
  }
};

/**
 * 查看
 * @param record
 */
const handleShow = async (record: RoleListItem) => {
  const hide = message.loading("正在加载数据");
  try {
    const { data } = await showRole({ id: record.id });
    hide();
    return data;
  } catch (error) {
    hide();
    message.error("加载失败请重试！");
    return false;
  }
};

/**
 *  删除
 * @param selectedRows
 */
const handleRemove = async (selectedRows: RoleListItem[]) => {
  const hide = message.loading("正在删除");
  if (!selectedRows) return true;
  try {
    await removeRole({
      ids: selectedRows.map((row) => row.id),
    });
    hide();
    message.success("删除成功!");
    return true;
  } catch (error) {
    hide();
    message.error("删除失败，请重试");
    return false;
  }
};

export default () => {
  const [sorter, setSorter] = useState<string>("");
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [showModalVisible, setShowModalVisible] = useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState<RoleListItem>();
  const actionRef = useRef<ActionType>();

  // 预先加载权限选择器数据
  const {
    data: permissionData,
    loading: permissionLoading,
    error: permissionError,
  } = useRequest(() => {
    return queryPermission({ pageSize: 1000 });
  });

  const columns: ProColumns<RoleListItem>[] = [
    {
      title: "ID",
      dataIndex: "id",
      hideInForm: true,
      ellipsis: true,
      fixed: "left",
      width: 80,
    },
    {
      title: "标识",
      dataIndex: "slug",
      ellipsis: true,
      width: 140,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "标识为必填项",
          },
        ],
      },
    },
    {
      title: "名称",
      dataIndex: "name",
      ellipsis: true,
      width: 140,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "名称为必填项",
          },
        ],
      },
    },
    {
      title: "权限",
      dataIndex: "permissions",
      hideInSearch: true,
      valueType: "select",
      fieldProps: {
        mode: "multiple",
        options: permissionData?.list?.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      },
      render: (_, record: RoleListItem) => {
        if (permissionError) {
          return <div>failed to load</div>;
        }
        if (permissionLoading) {
          return <div>loading...</div>;
        }
        return record.permissions?.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tag key={index} color="#87d068" style={{ marginBottom: 8 }}>
            {item.name}
          </Tag>
        ));
      },
    },
    {
      title: "更新时间",
      dataIndex: "updatedAt",
      sorter: true,
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "创建时间",
      dataIndex: "createdAt",
      sorter: true,
      valueType: "dateTime",
      hideInSearch: true,
      hideInForm: true,
    },
    {
      title: "操作",
      dataIndex: "option",
      valueType: "option",
      width: 140,
      fixed: "right",
      render: (_, record) => (
        <>
          <a
            onClick={async () => {
              // 编辑前去服务端获取最新的数据
              const success = await handleShow(record);
              if (success) {
                handleUpdateModalVisible(true);
                setCurrentRow(Object.assign(record, success));
              }
            }}
          >
            编辑
          </a>
          <Divider type="vertical" />
          <a
            onClick={async () => {
              // 查看前去服务端获取最新的数据
              const success = await handleShow(record);
              if (success) {
                setShowModalVisible(true);
                setCurrentRow(Object.assign(record, success));
              }
            }}
          >
            查看
          </a>
          <Divider type="vertical" />
          <Popconfirm
            title="你确定要删除该数据吗?"
            placement="left"
            onConfirm={async () => {
              const success = await handleRemove([record]);
              if (success) {
                setCurrentRow(undefined);
                actionRef?.current?.reload();
              }
            }}
            style={{ width: 220 }}
            okText="确定"
            cancelText="取消"
          >
            <a href="#">删除</a>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<RoleListItem>
        headerTitle="查询表格"
        actionRef={actionRef}
        rowKey="id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<RoleListItem>;
          if (sorterResult.field && sorterResult.order) {
            setSorter(`${sorterResult.field}_${sorterResult.order}`);
          } else {
            setSorter("");
          }
        }}
        params={{
          sorter,
        }}
        request={async (params) => {
          const { list, total } = (await queryRole(params)).data;
          return { data: list, total, success: true };
        }}
        columns={columns}
        rowSelection={{}}
        toolBarRender={(action, { selectedRows }) => [
          <Button
            type="primary"
            key="add"
            onClick={() => handleModalVisible(true)}
          >
            <PlusOutlined /> 新建
          </Button>,
          selectedRows && selectedRows.length > 0 && (
            <Dropdown
              overlay={
                <Menu
                  onClick={async (e) => {
                    if (e.key === "remove") {
                      const success = await handleRemove(selectedRows);
                      if (success) {
                        setCurrentRow(undefined);
                        action?.reload();
                        action?.clearSelected?.();
                      }
                    }
                  }}
                  selectedKeys={[]}
                >
                  <Menu.Item key="remove">批量删除</Menu.Item>
                </Menu>
              }
            >
              <Button>
                批量操作 <DownOutlined />
              </Button>
            </Dropdown>
          ),
        ]}
        tableAlertRender={({ selectedRowKeys }) => (
          <div>
            已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{" "}
            项&nbsp;&nbsp;
          </div>
        )}
        scroll={{ x: 1000 }}
      />

      {/* 创建 */}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        createModalVisible={createModalVisible}
      >
        <ProTable<RoleListItem, RoleListItem>
          onSubmit={async (values) => {
            const success = await handleCreate(values);
            if (success) {
              handleModalVisible(false);
              actionRef.current?.reload();
            }
          }}
          rowKey="id"
          type="form"
          form={{
            layout: "horizontal",
            labelCol: { span: 5 },
            wrapperCol: { span: 19 },
            submitter: {
              // 完全自定义整个区域
              render: (props) => {
                return (
                  <Space
                    align="center"
                    style={{ justifyContent: "center", width: "100%" }}
                  >
                    <Button
                      key="rest"
                      onClick={() => props.form?.resetFields()}
                    >
                      重置
                    </Button>
                    <Button
                      type="primary"
                      key="submit"
                      onClick={() => props.form?.submit?.()}
                    >
                      提交
                    </Button>
                  </Space>
                );
              },
            },
          }}
          columns={columns}
          rowSelection={{}}
        />
      </CreateForm>

      {/* 更新 */}
      {currentRow && Object.keys(currentRow).length ? (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
          }}
          updateModalVisible={updateModalVisible}
        >
          <ProTable<RoleListItem, RoleListItem>
            onSubmit={async (values) => {
              const success = await handleUpdate({
                ...values,
                id: (currentRow as RoleListItem).id,
              });
              if (success) {
                handleUpdateModalVisible(false);
                setCurrentRow(undefined);
                actionRef.current?.reload();
              }
            }}
            rowKey="id"
            type="form"
            form={{
              layout: "horizontal",
              labelCol: { span: 5 },
              wrapperCol: { span: 19 },
              initialValues: {
                ...currentRow,
                permissions: currentRow?.permissions?.map(({ id }) => id),
              },
              submitter: {
                // 完全自定义整个区域
                render: (props) => {
                  return (
                    <Space
                      align="center"
                      style={{ justifyContent: "center", width: "100%" }}
                    >
                      <Button
                        key="rest"
                        onClick={() => props.form?.resetFields()}
                      >
                        重置
                      </Button>
                      <Button
                        type="primary"
                        key="submit"
                        onClick={() => props.form?.submit?.()}
                      >
                        提交
                      </Button>
                    </Space>
                  );
                },
              },
            }}
            columns={columns}
            rowSelection={{}}
          />
        </UpdateForm>
      ) : null}

      {/* 详情 */}
      {currentRow && Object.keys(currentRow).length ? (
        <ShowForm
          onCancel={() => {
            setShowModalVisible(false);
            setCurrentRow(undefined);
          }}
          showModalVisible={showModalVisible}
          values={{
            ...currentRow,
            permissions: currentRow?.permissions?.map(({ name }) => name),
          }}
          columns={columns}
        />
      ) : null}
    </PageContainer>
  );
};
