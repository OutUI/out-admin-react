import React from "react";
import { Modal, Form, Input } from "antd";

import type { RoleListItem } from "@/services/admin/role.d";
import type { ProColumns } from "@ant-design/pro-table";

interface ShowFormProps {
  showModalVisible: boolean;
  onCancel: () => void;
  values: Partial<RoleListItem>;
  columns: ProColumns<RoleListItem>[];
}

const ShowForm: React.FC<ShowFormProps> = (props) => {
  const { showModalVisible, onCancel, values, columns } = props;
  return (
    <Modal
      destroyOnClose
      title="查看角色"
      visible={showModalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      <Form
        labelCol={{ span: 5 }}
        wrapperCol={{ span: 19 }}
        initialValues={values}
      >
        {columns.map(
          (item, index) =>
            item.dataIndex !== "option" && (
              // eslint-disable-next-line react/no-array-index-key
              <Form.Item key={index} label={item.title} name={item.dataIndex}>
                <Input disabled />
              </Form.Item>
            )
        )}
      </Form>
    </Modal>
  );
};

export default ShowForm;
