import { useRef, useState } from "react";
import { useRequest } from "umi";
import { PageHeaderWrapper } from "@ant-design/pro-layout";
import { Card, Alert, Row, Col, message, Popconfirm, Tag } from "antd";
import {
  PlusSquareOutlined,
  MinusSquareOutlined,
  FormOutlined,
  DeleteOutlined,
  SaveOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import Nestable from "antd-nestable";
import ToolBar from "@/components/ToolBar";

import {
  queryMenu,
  createMenu,
  updateMenu,
  removeMenu,
  orderMenu,
  showMenu,
} from "@/services/admin/menu";
import type { MenuListItem } from "@/services/admin/menu.d";

import { arrayTransTree, treeTransArray } from "@/utils/utils";

import styles from "./index.less";
import type { CreateFormHandleProps } from "./components/CreateForm";
import CreateForm from "./components/CreateForm";
import type { UpdateFormHandleProps } from "./components/UpdateForm";
import UpdateForm from "./components/UpdateForm";

/**
 * 添加
 * @param fields
 */
const handleCreate = async (fields: MenuListItem) => {
  const hide = message.loading("正在添加");
  try {
    await createMenu({ ...fields });
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
const handleUpdate = async (fields: MenuListItem) => {
  const hide = message.loading("正在更新");
  try {
    await updateMenu({
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
const handleShow = async (record: MenuListItem) => {
  const hide = message.loading("正在加载数据");
  try {
    const { data } = await showMenu({ id: record.id });
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
const handleRemove = async (selectedRows: MenuListItem[]) => {
  const hide = message.loading("正在删除");
  if (!selectedRows) return true;
  try {
    await removeMenu({
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

/**
 * 保存排序
 */
const handleOrder = async (orders: { id: string; parentId: string }[]) => {
  const hide = message.loading("正在保存");
  try {
    await orderMenu({ orders });
    hide();
    message.success("保存成功");
    return true;
  } catch (error) {
    hide();
    message.error("保存失败，请重试");
    return false;
  }
};

export default () => {
  const nestableRef =
    useRef<{ collapse: (type: string | number[]) => void }>(null);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [currentRow, setCurrentRow] = useState({});
  const createFormRef = useRef<CreateFormHandleProps>(null);
  const updateFormRef = useRef<UpdateFormHandleProps>(null);

  // 加载菜单数据
  const { data, loading, error, run } = useRequest(
    () => {
      return queryMenu({ pageSize: 1000 });
    },
    { throttleInterval: 500 }
  );

  const renderItem = (params: any) => {
    return (
      <>
        {params.handle}
        {params.collapseIcon}
        <strong>{params.item?.name}</strong>
        &nbsp;&nbsp;
        <a href="#">{params.item?.path}</a>
        <span className="pull-right">
          {params.item?.permission && (
            <Tag color="#87d068" style={{ marginBottom: 8 }}>
              {params.item.permission.name}
            </Tag>
          )}
          <a
            onClick={async () => {
              const success = await handleShow(params.item);
              if (success) {
                handleUpdateModalVisible(true);
                setCurrentRow(
                  Object.assign(params.item, {
                    permission: params.item.permission?.id,
                    roles: params?.item.roles.map(
                      (role: { id: any }) => role.id
                    ),
                  })
                );
              }
            }}
          >
            <FormOutlined />
          </a>
          &nbsp;&nbsp;
          <Popconfirm
            title={
              <>
                你确定要删除该数据吗?
                <br />
                删除后子节点也将同时被删除
              </>
            }
            placement="left"
            onConfirm={async () => {
              // 不论是否删除成功，都重新加载列表数据
              await handleRemove([params.item]);
              run();
            }}
            style={{ width: 220 }}
            okText="确定"
            cancelText="取消"
          >
            <a href="#">
              <DeleteOutlined />
            </a>
          </Popconfirm>
        </span>
      </>
    );
  };

  const collapse = (collapseCase: number, expendIds?: number[]) => {
    if (nestableRef.current) {
      switch (collapseCase) {
        case 0:
          nestableRef.current?.collapse("NONE");
          break;
        case 1:
          nestableRef.current?.collapse("ALL");
          break;
        case 2:
          nestableRef.current?.collapse(expendIds || []);
          break;
        default:
      }
    }
  };

  const NestableBox = () => {
    // 过滤默认选择的数据格式
    if (error) {
      return <div>failed to load</div>;
    }
    if (loading) {
      return <div>loading...</div>;
    }
    const items = arrayTransTree(data?.list as any[], "parentId") || [];
    return <Nestable ref={nestableRef} items={items} renderItem={renderItem} />;
  };

  return (
    <PageHeaderWrapper className={styles.main}>
      <Row gutter={[24, 24]}>
        <Col md={12} sm={24}>
          <Card bodyStyle={{ padding: 0 }}>
            <ToolBar
              headerTitle="查询表格"
              toolBarOptionRender={() => [
                // eslint-disable-next-line react/jsx-key
                <span
                  key="expand"
                  className="ant-pro-table-toolbar-item-icon"
                  title="展开"
                  onClick={() => {
                    collapse(0);
                  }}
                >
                  <PlusSquareOutlined />
                </span>,
                <span
                  key="collapse"
                  className="ant-pro-table-toolbar-item-icon"
                  title="折叠"
                  onClick={() => {
                    collapse(1);
                  }}
                >
                  <MinusSquareOutlined />
                </span>,
                <span
                  key="save"
                  className="ant-pro-table-toolbar-item-icon"
                  title="保存"
                  onClick={async () => {
                    const rows: MenuListItem[] =
                      treeTransArray(
                        (nestableRef.current as any)?.state?.items
                      ) || [];
                    const orders = rows.map((item) => ({
                      id: item.id,
                      parentId: item.parentId || "0",
                    }));
                    await handleOrder(orders);
                    run();
                  }}
                >
                  <SaveOutlined />
                </span>,
                <span
                  key="refresh"
                  className="ant-pro-table-toolbar-item-icon"
                  title="刷新"
                  onClick={run}
                >
                  <ReloadOutlined />
                </span>,
              ]}
            />
            <div className="ant-pro-table-alert">
              <Alert
                message={
                  <>
                    菜单管理仅做权限配置
                    <br /> 路由注册、name、Icon、地址配置均在前端编码完成
                    <br />
                    左侧菜单显示的名称在locales做国际化配置
                    <br />
                    需要鉴权的页面，在 config.ts 中配置 access:
                    &apos;canAdmin&apos; 即可走鉴权
                  </>
                }
                type="info"
                showIcon
              />
            </div>
            <div className="ant-pro-table-container">
              <NestableBox />
            </div>
          </Card>
        </Col>
        <Col md={12} sm={24}>
          <Card title="新建">
            <CreateForm
              ref={createFormRef}
              onSubmit={async (values) => {
                const success = await handleCreate(values);
                if (success) {
                  createFormRef.current?.reset();
                  run();
                }
              }}
            />
          </Card>
        </Col>
      </Row>

      {/* 更新 */}
      {updateModalVisible && Object.keys(currentRow).length ? (
        <UpdateForm
          onCancel={() => {
            handleUpdateModalVisible(false);
            setCurrentRow({});
            updateFormRef.current?.reset();
          }}
          values={currentRow as MenuListItem}
          updateModalVisible={updateModalVisible}
          onSubmit={async (values) => {
            const success = await handleUpdate(values);
            if (success) {
              handleUpdateModalVisible(false);
              setCurrentRow({});
              run();
            }
          }}
        />
      ) : null}
    </PageHeaderWrapper>
  );
};
