import { useState, useRef } from "react";
import { PageContainer } from "@ant-design/pro-layout";
import { DownOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Divider,
  message,
  Tag,
  Popconfirm,
  Select,
  Space,
  Dropdown,
  Menu,
} from "antd";
import type { ProColumns, ActionType } from "@ant-design/pro-table";
import ProTable from "@ant-design/pro-table";
import type { FormInstance } from "antd/es/form";
import { useRequest } from "umi";
// import ImgCrop from 'antd-img-crop';
import type { UploadFile } from "antd/lib/upload/interface";

import {
  queryUser,
  updateUser,
  createUser,
  removeUser,
  showUser,
} from "@/services/admin/user";
import { queryPermission } from "@/services/admin/permission";
import { queryRole } from "@/services/admin/role";
import type { UserListItem } from "@/services/admin/user.d";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import ShowForm from "./components/ShowForm";
import type { SorterResult } from "antd/lib/table/interface";
import type { RoleListItem } from "@/services/admin/role.d";

/**
 * 添加
 * @param fields
 */
const handleCreate = async (fields: UserListItem) => {
  const hide = message.loading("正在添加");
  const avatar = (fields.avatar as unknown as UploadFile[]) || [];
  try {
    await createUser({ ...fields, avatar: avatar[0]?.response?.url });
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
const handleUpdate = async (fields: UserListItem) => {
  const hide = message.loading("正在更新");
  try {
    await updateUser({
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
const handleShow = async (record: UserListItem) => {
  const hide = message.loading("正在加载数据");
  try {
    const { data } = await showUser({ id: record.id });
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
const handleRemove = async (selectedRows: UserListItem[]) => {
  const hide = message.loading("正在删除");
  if (!selectedRows) return true;
  try {
    await removeUser({
      ids: selectedRows.map((row) => row.id),
    });
    hide();
    message.success("删除成功");
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
  const [currentRow, setCurrentRow] = useState<UserListItem>();
  const actionRef = useRef<ActionType>();
  const creatFormRef = useRef<FormInstance>();
  const updateFormRef = useRef<FormInstance>();

  // 预先加载权限选择器数据
  const {
    data: permissionData,
    loading: permissionLoading,
    error: permissionError,
  } = useRequest(() => {
    return queryPermission({ pageSize: 1000 });
  });

  // 预先加载角色选择器数据
  const {
    data: roleData,
    loading: roleLoading,
    error: roleError,
  } = useRequest(() => {
    return queryRole({ pageSize: 1000 });
  });

  const columns: ProColumns<UserListItem>[] = [
    {
      title: "ID",
      dataIndex: "id",
      hideInForm: true,
      ellipsis: true,
      fixed: "left",
      width: 80,
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
          {
            message: "名称长度不能超过32个字符",
            max: 32,
          },
        ],
      },
    },
    {
      title: "账号",
      dataIndex: "username",
      ellipsis: true,
      width: 140,
      hideInForm: true,
    },
    {
      title: "账号",
      dataIndex: "username",
      ellipsis: true,
      hideInSearch: true,
      width: 140,
      fieldProps: {
        placeholder: "只允许包含数字、字母、下划线，长度为5-32位字符",
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "账号为必填项",
          },
          {
            pattern: new RegExp("^[0-9a-zA-Z_]{5,32}$", "g"),
            message: "只允许包含数字、字母、下划线，长度为5-32位字符",
          },
        ],
      },
    },
    {
      title: "密码",
      dataIndex: "password",
      valueType: "password",
      hideInSearch: true,
      hideInTable: true,
      fieldProps: {
        placeholder: "6-60个字符",
      },
      formItemProps: {
        rules: [
          {
            required: true,
            message: "密码为必填项",
          },
          {
            message: "密码长度必须为6-60个字符",
            max: 60,
            min: 6,
          },
        ],
      },
    },
    {
      title: "确认密码",
      dataIndex: "passwordConfirmation",
      valueType: "password",
      hideInSearch: true,
      hideInTable: true,
      formItemProps: {
        validateFirst: true,
        rules: [
          {
            required: true,
            message: "确认密码为必填项",
          },
          {
            validator: (rules, value, callback) => {
              const password =
                (createModalVisible &&
                  creatFormRef.current?.getFieldValue("password")) ||
                (updateModalVisible &&
                  updateFormRef.current?.getFieldValue("password"));
              if (password !== value) {
                callback("两次密码输入不一致");
              } else {
                callback();
              }
            },
          },
        ],
      },
    },
    {
      title: "权限",
      dataIndex: "permissions",
      hideInSearch: true,
      renderFormItem: () => {
        // 过滤默认选择的数据格式
        if (permissionError) {
          return <div>failed to load</div>;
        }
        if (permissionLoading) {
          return <div>loading...</div>;
        }
        return (
          <Select
            showSearch
            allowClear
            mode="multiple"
            filterOption={(inputValue, option) => {
              return (option?.label as string)
                .toLocaleLowerCase()
                .includes(inputValue.toLocaleLowerCase());
            }}
            options={permissionData?.list?.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        );
      },
      render: (_, record: UserListItem) =>
        record.permissions?.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tag key={index} color="#87d068" style={{ marginBottom: 8 }}>
            {item.name}
          </Tag>
        )),
    },
    {
      title: "角色",
      dataIndex: "roles",
      hideInSearch: true,
      renderFormItem: () => {
        if (roleError) {
          return <div>failed to load</div>;
        }
        if (roleLoading) {
          return <div>loading...</div>;
        }
        return (
          <Select
            showSearch
            allowClear
            mode="multiple"
            filterOption={(inputValue, option) => {
              return (option?.label as string)
                .toLocaleLowerCase()
                .includes(inputValue.toLocaleLowerCase());
            }}
            options={roleData?.list?.map((item) => ({
              label: item.name,
              value: item.id,
            }))}
          />
        );
      },
      render: (_, record: UserListItem) =>
        record.roles?.map((item, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Tag key={index} color="#87d068" style={{ marginBottom: 8 }}>
            {item.name}
          </Tag>
        )),
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
                success.passwordConfirmation = success.password;
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
              // 不论是否删除成功，都重新加载列表数据
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
      <ProTable<UserListItem>
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
          const { list, total } = (await queryUser(params)).data;
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
      {createModalVisible ? (
        <CreateForm
          onCancel={() => handleModalVisible(false)}
          createModalVisible={createModalVisible}
        >
          <ProTable<UserListItem, UserListItem>
            formRef={creatFormRef}
            onSubmit={async (values) => {
              delete values.passwordConfirmation;
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
      ) : null}

      {/* 更新 */}
      {currentRow && Object.keys(currentRow).length ? (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false);
            setCurrentRow(undefined);
          }}
          updateModalVisible={updateModalVisible}
        >
          <ProTable<UserListItem, UserListItem>
            formRef={updateFormRef}
            onSubmit={async (values) => {
              delete values.passwordConfirmation;
              const success = await handleUpdate({
                ...values,
                id: (currentRow as UserListItem).id,
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
                permissions: (currentRow as UserListItem).permissions?.map(
                  (row) => row.id
                ),
                roles: (currentRow as UserListItem).roles?.map((row) => row.id),
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
            permissions: (currentRow as UserListItem).permissions?.map(
              (row) => row.name
            ),
            roles: (currentRow as UserListItem).roles?.map((row) => row.name),
          }}
          columns={columns}
        />
      ) : null}
    </PageContainer>
  );
};
