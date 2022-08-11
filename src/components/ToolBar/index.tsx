import React from "react";
import "@ant-design/pro-table";

interface ToolBarProps {
  headerTitle?: React.ReactNode; // 标题
  toolBarRender?: () => React.ReactNode[];
  toolBarOptionRender?: () => React.ReactNode[];
}

const ToolBar: React.FC<ToolBarProps> = ({
  headerTitle,
  toolBarRender,
  toolBarOptionRender,
}) => {
  const actions = toolBarRender ? toolBarRender() : [];
  const options = toolBarOptionRender ? toolBarOptionRender() : [];
  return (
    <div className="ant-pro-table-toolbar">
      <div className="ant-pro-table-toolbar-title">
        {headerTitle || "查询表格"}
      </div>
      <div className="ant-pro-table-toolbar-option">
        <div className="ant-space ant-space-horizontal ant-space-align-center">
          {actions
            .filter((item) => item)
            .map((node, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <div key={index} className="ant-space-item">
                {node}
              </div>
            ))}
        </div>
        <div className="ant-pro-table-toolbar-default-option">
          <div className="ant-divider ant-divider-vertical" role="separator" />
          <div className="ant-space ant-space-horizontal ant-space-align-center">
            {options
              .filter((item) => item)
              .map((node, index) => (
                // eslint-disable-next-line react/no-array-index-key
                <div key={index} className="ant-space-item">
                  {node}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default ToolBar;
