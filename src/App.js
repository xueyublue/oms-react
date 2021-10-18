import { useLocation, useHistory } from "react-router-dom";
import { useState } from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";

import NavBar from "./components/NavBar";
import AppBar from "./components/AppBar";
import AppFooter from "./components/AppFooter";
import { RouteToPageName } from "./util/constants";
import RouteContainer from "./components/RouteContainer";

const { Content } = Layout;

function App() {
  const history = useHistory();
  const userId = localStorage.getItem("oms-userid");
  const password = localStorage.getItem("oms-password");
  // const sessionExpiry = localStorage.getItem("oms-session-expiry");

  const [pageWithoutNavigation, setPageWithoutNavigation] = useState(false);
  const { pathname } = useLocation();
  if (pathname === "/login" && !pageWithoutNavigation) setPageWithoutNavigation(true);
  if (pathname !== "/login" && pageWithoutNavigation) setPageWithoutNavigation(false);

  if (pathname !== "/login") {
    if (!userId || !password) {
      localStorage.removeItem("oms-userid");
      localStorage.removeItem("oms-password");
      history.push("/login");
    }
  }

  if (pageWithoutNavigation)
    return (
      <Layout className="site-layout" style={{ minHeight: "100vh" }}>
        <Content className="site-layout-background" style={{ padding: 8 }}>
          <RouteContainer />
        </Content>
        <AppFooter />
      </Layout>
    );

  return (
    <Layout>
      <NavBar />
      <Layout className="site-layout" style={{ marginLeft: 220, minHeight: "100vh" }}>
        <AppBar pageName={RouteToPageName(pathname)} />
        <Content
          className="site-layout-background"
          style={{
            margin: "8px 8px",
            padding: 8,
            minHeight: 650,
          }}
        >
          <RouteContainer />
        </Content>
        <AppFooter />
      </Layout>
    </Layout>
  );
}

export default App;
