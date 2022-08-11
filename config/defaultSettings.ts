import { Settings as LayoutSettings } from "@ant-design/pro-layout";

const Settings: LayoutSettings & {
  pwa?: boolean;
  logo?: string;
} = {
  title: false,
  navTheme: "dark",
  primaryColor: "#1890ff",
  layout: "side",
  contentWidth: "Fluid",
  fixedHeader: true,
  fixSiderbar: true,
  pwa: false,
  logo: "/logo.svg",
  headerHeight: 48,
  splitMenus: false,
  //headerRender: false,
  footerRender: false,
};

export default Settings;
