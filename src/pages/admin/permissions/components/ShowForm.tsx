import React from "react";
import { Modal, Tag } from "antd";
import type { PermListItem } from "@/services/admin/permission.d";
import ProDescriptions from "@ant-design/pro-descriptions";

interface ShowFormProps {
  showModalVisible: boolean;
  onCancel: () => void;
  values: Partial<PermListItem>;
}

const ShowForm: React.FC<ShowFormProps> = (props) => {
  const { showModalVisible, onCancel, values } = props;
  return (
    <Modal
      destroyOnClose
      title="查看权限"
      visible={showModalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <ProDescriptions column={1}>
        <ProDescriptions.Item label="标识">{values.slug}</ProDescriptions.Item>
        <ProDescriptions.Item label="名称">{values.name}</ProDescriptions.Item>
        <ProDescriptions.Item label="路由">
          <div>
            {values.httpPath?.split("\n").map((item, key, array) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div key={key} style={{ marginBottom: 3 }}>
                  {values.httpMethod && values.httpMethod?.length > 0 ? (
                    values?.httpMethod?.map((text, index) => (
                      // eslint-disable-next-line react/no-array-index-key
                      <Tag key={index} color="#108ee9">
                        {text}
                      </Tag>
                    ))
                  ) : (
                    <Tag color="#108ee9">ANY</Tag>
                  )}
                  <Tag color="red">{item}</Tag>
                  {key !== array.length - 1 && <br />}
                </div>
              );
            })}
          </div>
        </ProDescriptions.Item>
      </ProDescriptions>
    </Modal>
  );
};

export default ShowForm;
