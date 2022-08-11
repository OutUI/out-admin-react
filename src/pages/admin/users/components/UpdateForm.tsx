import React from "react";
import { Modal } from "antd";

interface UpdateFormProps {
  updateModalVisible: boolean;
  onCancel: () => void;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => {
  const { updateModalVisible, onCancel } = props;

  return (
    <Modal
      destroyOnClose
      title="修改用户"
      visible={updateModalVisible}
      onCancel={() => onCancel()}
      footer={null}
      width={768}
    >
      {props.children}
    </Modal>
  );
};

export default UpdateForm;
