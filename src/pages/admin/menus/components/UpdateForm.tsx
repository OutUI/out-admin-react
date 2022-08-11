import React, { forwardRef, useImperativeHandle, useEffect } from "react";
import { Form, Button, Space, Input, Modal } from "antd";

import type { MenuListItem } from "@/services/admin/menu.d";
import BaseFormItems from "./BaseFormItems";

export interface UpdateFormHandleProps {
  reset: () => void;
  fill: (value: MenuListItem) => void;
}

interface UpdateFormProps {
  updateModalVisible: boolean;
  onCancel: () => void;
  onSubmit: (value: MenuListItem) => void;
  values: MenuListItem;
}

const UpdateForm: React.RefForwardingComponent<
  UpdateFormHandleProps,
  UpdateFormProps
> = ({ onSubmit, onCancel, updateModalVisible, values }, ref) => {
  // const { onCancel } = props
  const [form] = Form.useForm();

  const onFinish = async (fields: MenuListItem) => {
    onSubmit(fields);
  };

  const onReset = () => {
    form?.resetFields();
  };

  const onFill = (fields: MenuListItem) => {
    form.setFieldsValue(fields);
  };

  useImperativeHandle(ref, () => ({
    reset: (): void => {
      onReset();
    },
    fill: (fields: MenuListItem): void => {
      onFill(fields);
    },
  }));

  useEffect(() => {
    onFill(values);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [values]);

  return (
    <Modal
      destroyOnClose
      title="修改菜单"
      visible={updateModalVisible}
      onCancel={() => onCancel()}
      footer={null}
      width={768}
    >
      <Form
        form={form}
        labelCol={{ span: 4 }}
        wrapperCol={{ span: 20 }}
        onFinish={(fileds) => onFinish(fileds as MenuListItem)}
      >
        <Form.Item name="id" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <BaseFormItems disabledParentKeys={[values.id]} />
        <div style={{ textAlign: "right" }}>
          <Space size="middle" direction="horizontal" align="center">
            <Button
              htmlType="button"
              onClick={() => {
                onFill(values);
              }}
            >
              重置
            </Button>
            <Button type="primary" htmlType="submit">
              提交
            </Button>
          </Space>
        </div>
      </Form>
    </Modal>
  );
};

export default forwardRef(UpdateForm);
