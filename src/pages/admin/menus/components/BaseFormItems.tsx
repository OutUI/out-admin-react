import React from "react";
import { Form, Input, Transfer, Select, TreeSelect } from "antd";
import { useRequest } from "umi";

import { queryPermission } from "@/services/admin/permission";
import { queryMenu } from "@/services/admin/menu";
import { queryRole } from "@/services/admin/role";

import { arrayTransTree } from "@/utils/utils";

interface CustomFormItemProps {
  value?: any;
  onChange?: (values: any) => void;
  id?: string;
}

const BaseFormItems: React.FC<{
  disabledParentKeys?: string[];
}> = ({ disabledParentKeys }) => {
  // 加载菜单数据
  const {
    data: menuData,
    loading: menuLoading,
    error: menuError,
  } = useRequest(() => {
    return queryMenu({ pageSize: 1000 });
  });

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

  const ParentFormItem: React.FC<CustomFormItemProps> = ({
    value,
    onChange,
  }) => {
    const newValue = value || null;
    // 过滤默认选择的数据格式
    if (menuError) {
      return <div>failed to load</div>;
    }
    if (menuLoading) {
      return <div>loading...</div>;
    }
    const treeData =
      arrayTransTree(
        (menuData?.list as any[]).map((item) => ({
          ...item,
          title: item.name,
          value: item.id,
          disabled: disabledParentKeys?.includes(item.id),
        })),
        "parentId"
      ) || [];
    return (
      <TreeSelect
        allowClear
        placeholder="请选择，不选表示根节点，不可循环嵌套"
        style={{ width: "100%" }}
        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
        value={newValue}
        onChange={onChange}
        treeData={treeData}
        treeDefaultExpandAll
      />
    );
  };

  const PermissionsFormItem: React.FC<CustomFormItemProps> = ({
    value,
    onChange,
  }) => {
    // 过滤默认选择的数据格式
    if (permissionError) {
      return <div>failed to load</div>;
    }
    if (permissionLoading) {
      return <div>loading...</div>;
    }
    return (
      <Select
        value={value}
        onChange={onChange}
        showSearch
        allowClear
        placeholder="选择权限"
        options={permissionData?.list?.map((item) => ({
          label: item.name,
          name: item.name,
          value: item.id,
        }))}
        filterOption={(input, option) => {
          if (input && option && option.name) {
            return (
              option?.name?.toLowerCase().indexOf(input.toLowerCase()) >= 0
            );
          }
          return false;
        }}
      />
    );
  };

  const RolesFormItem: React.FC<CustomFormItemProps> = ({
    value,
    onChange,
  }) => {
    // 过滤默认选择的数据格式
    const newValue = value?.map((row: any) => row.id || row);
    if (roleError) {
      return <div>failed to load</div>;
    }
    if (roleLoading) {
      return <div>loading...</div>;
    }
    return (
      <Transfer
        onChange={onChange}
        titles={["待选", "已选"]}
        listStyle={{
          width: 300,
          height: 300,
        }}
        dataSource={roleData?.list as any[]}
        targetKeys={newValue}
        showSearch
        rowKey={(row: any) => row.id}
        render={(row: any) => row.name}
        pagination
      />
    );
  };
  return (
    <>
      <Form.Item name="parentId" label="Parent">
        <ParentFormItem />
      </Form.Item>
      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: "name为必填项",
          },
        ]}
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item
        name="path"
        label="Path"
        rules={[
          {
            required: true,
            message: "path为必填项",
          },
        ]}
      >
        <Input placeholder="请输入" />
      </Form.Item>
      <Form.Item name="roles" label="角色">
        <RolesFormItem />
      </Form.Item>
      <Form.Item name="permission" label="权限">
        <PermissionsFormItem />
      </Form.Item>
    </>
  );
};

export default BaseFormItems;
