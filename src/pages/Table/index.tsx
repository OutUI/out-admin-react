import React, { useState } from "react";
import { Affix, Badge, Button, Col, Drawer, Row, Space, Table } from "antd";
import ProCard from "@ant-design/pro-card";
import styles from "./index.less";
import { DeleteOutlined } from "@ant-design/icons";

const colSpan = { xs: 12, sm: 8, md: 4, lg: 3, xl: 3 };

const setStatus = (i: number) => {
  let color = "";
  if (i === 20) {
    color = "#ffac27";
  } else if (i === 21) {
    color = "#53c7a0";
  } else if (i === 22) {
    color = "#ed6855";
  } else if (i === 23) {
    color = "#7ebeec";
  }
  return color;
};

const renderTables: any = ({ openDrawer }: any) => {
  const tables: any = [];
  for (let i = 1; i <= 60; i++) {
    tables.push(
      <ProCard
        key={i}
        className="__green"
        colSpan={colSpan}
        title={<span style={{ fontSize: 12 }}>{i}号桌</span>}
        extra={"8座"}
        size="small"
        bordered
        style={{ minHeight: 90, background: setStatus(i) }}
        bodyStyle={{ padding: "12px 12px 5px" }}
        onClick={openDrawer}
      >
        {i >= 20 && i <= 23 && (
          <>
            <div style={{ textAlign: "center", fontWeight: "bold" }}>
              500<span style={{ color: "#666", fontSize: 12 }}>元</span>
            </div>
            <Row style={{ color: "#666", fontSize: 12, marginTop: 5 }}>
              <Col span={12}>3人</Col>
              <Col span={12} style={{ textAlign: "right" }}>
                12:00
              </Col>
            </Row>
          </>
        )}
      </ProCard>
    );
  }
  return tables;
};

const Tables: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [, setCurrentTable] = useState();

  const drawerProps = {
    onClose() {
      setDrawerVisible(false);
    },
  };

  const openDrawer = () => {
    setDrawerVisible(true);
    setCurrentTable(undefined);
  };

  const dataSource = [
    {
      key: "1",
      name: "辣椒炒肉",
      total: 1,
      money: 30,
      remark: "少辣，少葱",
    },
    {
      key: "2",
      name: "土豆丝",
      total: 1,
      money: 10,
    },
    {
      key: "3",
      name: "黄焖鸡",
      total: 1,
      money: 58,
    },
    {
      key: "4",
      name: "精品特色铁板-烧牛肉",
      total: 3,
      money: 50,
      remark: "少辣",
    },
    {
      key: "44",
      name: "小龙虾",
      total: 3,
      money: 50,
    },
    {
      key: "5",
      name: "小龙虾",
      total: 3,
      money: 50,
    },
    {
      key: "6",
      name: "小龙虾",
      total: 3,
      money: 50,
    },
  ];

  const columns = [
    {
      title: "名称",
      dataIndex: "name",
      key: "name",
      width: "35%",
    },
    {
      title: "数量",
      dataIndex: "total",
      key: "total",
      width: "15%",
    },
    {
      title: "金额",
      dataIndex: "money",
      key: "money",
      width: "18%",
    },
    {
      title: "口味",
      dataIndex: "remark",
      key: "remark",
      width: "20%",
    },
    {
      title: "",
      key: "action",
      with: 20,
      render: () => (
        <Space size="middle">
          <a>
            <DeleteOutlined />
          </a>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <ProCard ghost gutter={[16, 16]} wrap className="__tables">
        {renderTables({ openDrawer })}
      </ProCard>
      <div className={styles.status}>
        <Badge color="#53c7a0" text="已开单" />
        <Badge color="#ed6855" text="待结账" />
        <Badge color="#7ebeec" text="已完成" />
      </div>
      <Drawer
        className={styles.detailDrawer}
        title="20号桌"
        placement="right"
        visible={drawerVisible}
        width="80%"
        {...drawerProps}
      >
        <Row>
          <Col span={16}>
            <span className="title">订单号：</span>001
          </Col>
          <Col span={8}>
            <span className="title">桌位号：</span>20
          </Col>
          <Col span={16}>
            <span className="title">开台时间：</span>2022-05-01 12:00:00
          </Col>
          <Col span={8}>
            <span className="title">就餐人数：</span>3
          </Col>
          <Col span={16}>
            <span className="title">用餐时间：</span>30分钟58秒
          </Col>
          <Col span={8}>
            <span className="title">订单状态：</span>已开单
          </Col>
          <Col span={16}>
            <span className="title">备注：</span>少辣、少葱、少油
          </Col>
          <Col span={24}>
            <Table
              className={styles.orderDetail}
              dataSource={dataSource}
              columns={columns}
              size="small"
              pagination={false}
              footer={() => (
                <Row>
                  <Col span={8}>
                    <strong>共8份</strong>
                  </Col>
                  <Col span={8}>
                    <strong>合计：￥80</strong>
                  </Col>
                </Row>
              )}
            />
            <Affix offsetBottom={10}>
              <div
                style={{
                  textAlign: "center",
                  marginTop: 10,
                  padding: "10px 0",
                  background: "#fff",
                }}
              >
                <Space size={10} wrap>
                  <Button type="primary" danger>
                    结 账
                  </Button>
                  <Button> 加 菜 </Button>
                  <Button> 换 桌 </Button>
                  <Button> 修改人数 </Button>
                  <Button> 并 桌 </Button>
                  <Button> 退 桌 </Button>
                  <Button> 撤 单 </Button>
                  <Button> 前台打印 </Button>
                </Space>
              </div>
            </Affix>
          </Col>
        </Row>
      </Drawer>
    </div>
  );
};

export default Tables;
