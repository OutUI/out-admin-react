import React from "react";
import { Modal } from "antd";

interface CreateFormProps {
  createModalVisible: boolean;
  onCancel: () => void;
}

const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { createModalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="新建权限"
      visible={createModalVisible}
      onCancel={() => onCancel()}
      footer={null}
    >
      {props.children}
    </Modal>
  );
};

export default CreateForm;
