import { useLocation } from "react-router-dom";
import { useState } from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";

import NavBar from "./components/NavBar";
import AppBar from "./components/AppBar";
import AppFooter from "./components/AppFooter";
import { RouteToPageName } from "./util/constants";
import PageContainer from "./components/PageContainer";

import "./styles/global.css";

const { Content } = Layout;

function App() {
  const [pageWithoutNavigation, setPageWithoutNavigation] = useState(false);
  const { pathname } = useLocation();
  console.log(pathname);
  if (pathname === "/login" && !pageWithoutNavigation) setPageWithoutNavigation(true);
  if (pathname !== "/login" && pageWithoutNavigation) setPageWithoutNavigation(false);

  if (pageWithoutNavigation)
    return (
      <Layout className="site-layout" style={{ minHeight: "100vh" }}>
        <Content className="site-layout-background" style={{ padding: 8 }}>
          <PageContainer />
        </Content>
        <AppFooter />
      </Layout>
    );

  return (
    <Layout>
      <NavBar />
      <Layout className="site-layout" style={{ marginLeft: 220, minHeight: "100vh" }}>
        <AppBar pageName={RouteToPageName("")} />
        <Content
          className="site-layout-background"
          style={{
            margin: "8px 8px",
            padding: 8,
            minHeight: 650,
          }}
        >
          <PageContainer />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
}

export default App;
