import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  message,
  Tag,
  Divider,
  Popconfirm,
  Space,
  Dropdown,
  Menu,
} from "antd";
import { useState, useRef } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import UpdateForm from "./components/UpdateForm";
import type { PermListItem } from "@/services/admin/permission.d";
import {
  queryPermission,
  createPermission,
  updatePermission,
  removePermission,
  showPermission,
} from "@/services/admin/permission";
import CreateForm from "./components/CreateForm";
import ShowForm from "./components/ShowForm";
import type { SorterResult } from "antd/lib/table/interface";

/**
 * 添加
 * @param fields
 */
const handleCreate = async (fields: PermListItem) => {
  const hide = message.loading("正在添加");
  try {
    await createPermission({ ...fields });
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
const handleUpdate = async (fields: PermListItem) => {
  const hide = message.loading("正在更新");
  try {
    await updatePermission({
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
const handleShow = async (record: PermListItem) => {
  const hide = message.loading("正在加载数据");
  try {
    const { data } = await showPermission({ id: record.id });
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
const handleRemove = async (selectedRows: PermListItem[]) => {
  const hide = message.loading("正在删除");
  if (!selectedRows) return true;
  try {
    await removePermission({
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
  const [showDetail, setShowDetail] = useState<boolean>(false);
  const actionRef = useRef<ActionType>();
  const [currentRow, setCurrentRow] = useState<PermListItem>();

  const columns: ProColumns<PermListItem>[] = [
    {
      title: "ID",
      dataIndex: "id",
      hideInForm: true,
      hideInSearch: true,
      ellipsis: true,
      width: 50,
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
      title: "HTTP方法",
      dataIndex: "httpMethod",
      hideInTable: true,
      hideInForm: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "HTTP方法为必填项",
          },
        ],
      },
      valueEnum: {
        ANY: { text: "ANY", status: "Default" },
        GET: { text: "GET", status: "Default" },
        POST: { text: "POST", status: "Default" },
        PUT: { text: "PUT", status: "Default" },
        DELETE: { text: "DELETE", status: "Default" },
        PATCH: { text: "PATCH", status: "Default" },
        OPTIONS: { text: "OPTIONS", status: "Default" },
        HEAD: { text: "HEAD", status: "Default" },
      },
    },
    {
      title: "HTTP方法",
      dataIndex: "httpMethod",
      hideInTable: true,
      hideInSearch: true,
      valueEnum: {
        ANY: { text: "ANY", status: "Default" },
        GET: { text: "GET", status: "Default" },
        POST: { text: "POST", status: "Default" },
        PUT: { text: "PUT", status: "Default" },
        DELETE: { text: "DELETE", status: "Default" },
        PATCH: { text: "PATCH", status: "Default" },
        OPTIONS: { text: "OPTIONS", status: "Default" },
        HEAD: { text: "HEAD", status: "Default" },
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "HTTP方法为必填项",
          },
        ],
      },
      fieldProps: {
        mode: "multiple",
      },
    },
    {
      title: "HTTP路径",
      dataIndex: "httpPath",
      hideInTable: true,
      valueType: "textarea",
      formItemProps: {
        rules: [
          {
            required: true,
            message: "HTTP路径为必填项",
          },
        ],
      },
    },
    {
      title: "路由",
      dataIndex: "httpMethod",
      hideInSearch: true,
      hideInForm: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: "标识为必填项",
          },
        ],
      },
      render: (_, record: PermListItem) =>
        record.httpPath?.split("\n").map((item, key) => {
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={key} style={{ marginBottom: 3 }}>
              {record.httpMethod?.length > 0 ? (
                record.httpMethod.map((text, index) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Tag key={index} color="#108ee9">
                    {text}
                  </Tag>
                ))
              ) : (
                <Tag color="#108ee9">ANY</Tag>
              )}
              <Tag color="red">{item}</Tag>
            </div>
          );
        }),
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
            key="edit"
            onClick={async () => {
              const success = await handleShow(record);
              if (success) {
                handleUpdateModalVisible(true);
                setCurrentRow(Object.assign(record, success));
              }
            }}
          >
            编辑
          </a>
          <Divider key="d1" type="vertical" />
          <a
            key="show"
            onClick={async () => {
              // 查看前去服务端获取最新的数据
              const success = await handleShow(record);
              if (success) {
                setShowDetail(true);
                setCurrentRow(Object.assign(record, success));
              }
            }}
          >
            查看
          </a>
          <Divider key="d2" type="vertical" />
          <Popconfirm
            key="del"
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
      <ProTable<PermListItem>
        headerTitle={"查询表格"}
        actionRef={actionRef}
        rowKey="id"
        onChange={(_, _filter, _sorter) => {
          const sorterResult = _sorter as SorterResult<PermListItem>;
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
          const { list, total } = (await queryPermission(params)).data;
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
        scroll={{ x: 1400 }}
      />
      {/* 创建 */}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        createModalVisible={createModalVisible}
      >
        <ProTable<PermListItem, PermListItem>
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
          <ProTable<PermListItem, PermListItem>
            onSubmit={async (values) => {
              const success = await handleUpdate({
                ...values,
                id: (currentRow as PermListItem).id,
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
              initialValues: currentRow,
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
            setShowDetail(false);
            setCurrentRow(undefined);
          }}
          showModalVisible={showDetail}
          values={currentRow}
        />
      ) : null}
    </PageContainer>
  );
};
