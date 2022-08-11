import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, message } from "antd";
import React, { useState } from "react";
import { ProFormCheckbox, ProFormText, LoginForm } from "@ant-design/pro-form";
import { history, useModel } from "umi";
import Footer from "@/components/Footer";
import { login } from "@/services/ant-design-pro/api";
import styles from "./index.less";

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>();
  const [type] = useState<string>("account");
  const { initialState, setInitialState } = useModel("@@initialState");

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();

    if (userInfo) {
      await setInitialState((s) => ({ ...s, currentUser: userInfo }));
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      const msg = await login({ ...values, type });

      if (msg.data && msg.data.status === "ok") {
        const defaultLoginSuccessMessage = "登录成功！";
        message.success(defaultLoginSuccessMessage);
        sessionStorage.setItem("token", msg.data.token || "");
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */

        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as {
          redirect: string;
        };
        history.push(redirect || "/");
        return;
      }

      console.log(msg); // 如果失败去设置用户错误信息

      setUserLoginState(msg);
    } catch (error) {
      const defaultLoginFailureMessage = "登录失败，请重试！";
      message.error(defaultLoginFailureMessage);
    }
  };

  const { status, type: loginType } = userLoginState?.data || {};
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LoginForm
          logo={<img alt="logo" src="/logo.svg" />}
          title="点餐管理系统"
          subTitle={" "}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as API.LoginParams);
          }}
        >
          {status === "error" && loginType === "account" && (
            <LoginMessage content={"错误的用户名和密码(admin/ant.design)"} />
          )}
          <ProFormText
            name="username"
            fieldProps={{
              size: "large",
              prefix: <UserOutlined className={styles.prefixIcon} />,
            }}
            placeholder={"用户名"}
            rules={[
              {
                required: true,
                message: "用户名是必填项！",
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: "large",
              prefix: <LockOutlined className={styles.prefixIcon} />,
            }}
            placeholder={"密码"}
            rules={[
              {
                required: true,
                message: "密码是必填项！",
              },
            ]}
          />

          {status === "error" && loginType === "mobile" && (
            <LoginMessage content="验证码错误" />
          )}
          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              自动登录
            </ProFormCheckbox>
            <a
              style={{
                float: "right",
              }}
            >
              忘记密码 ?
            </a>
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
