import React, { forwardRef, useImperativeHandle } from "react";
import { Form, Button, Space } from "antd";

import type { MenuListItem } from "@/services/admin/menu.d";
import BaseFormItems from "./BaseFormItems";

export interface CreateFormHandleProps {
  reset: () => void;
}

interface CreateFormProps {
  onCancel?: () => void;
  onSubmit: (value: MenuListItem) => void;
}

const CreateForm: React.RefForwardingComponent<
  CreateFormHandleProps,
  CreateFormProps
> = ({ onSubmit }, ref) => {
  // const { onCancel } = props
  const [form] = Form.useForm();

  const onFinish = async (fields: MenuListItem) => {
    onSubmit(fields);
  };

  const onReset = () => {
    form?.resetFields();
  };

  useImperativeHandle(ref, () => ({
    reset: (): void => {
      onReset();
    },
  }));

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 20 }}
      onFinish={(values) => onFinish(values as MenuListItem)}
    >
      <BaseFormItems />
      <Form.Item wrapperCol={{ offset: 4, span: 20 }}>
        <Space size="middle" direction="horizontal" align="center">
          <Button htmlType="button" onClick={onReset}>
            重置
          </Button>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
};

export default forwardRef(CreateForm);
