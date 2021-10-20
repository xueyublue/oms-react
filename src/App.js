import { useLocation, useHistory } from "react-router-dom";
import { useState } from "react";
import { Layout } from "antd";
import "antd/dist/antd.css";

import NavBar from "./components/NavBar";
import AppBar from "./components/AppBar";
import AppFooter from "./components/AppFooter";
import { RouteToPageName } from "./util/constants";
import RouteContainer from "./components/RouteContainer";
import { ROUTE_LOGIN } from "./util/constants";
import { BackendAPIProvider } from "./context/BackendAPIContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const { Content } = Layout;

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
function App() {
  const history = useHistory();
  const userId = localStorage.getItem("oms-userid");
  const username = localStorage.getItem("oms-username");
  // const sessionExpiry = localStorage.getItem("oms-session-expiry");

  const [pageWithoutNavigation, setPageWithoutNavigation] = useState(false);
  const { pathname } = useLocation();
  if (pathname === ROUTE_LOGIN && !pageWithoutNavigation) setPageWithoutNavigation(true);
  if (pathname !== ROUTE_LOGIN && pageWithoutNavigation) setPageWithoutNavigation(false);

  // validate User ID and Password for non-login pages
  if (pathname !== ROUTE_LOGIN) {
    if (!userId || !username) {
      localStorage.removeItem("oms-userid");
      localStorage.removeItem("oms-username");
      history.push(ROUTE_LOGIN);
    }
  }

  // no navigation bars for login pages
  if (pageWithoutNavigation)
    return (
      <BackendAPIProvider>
        <Layout className="site-layout" style={{ minHeight: "100vh" }}>
          <Content className="site-layout-background" style={{ padding: 8 }}>
            <RouteContainer />
          </Content>
          <AppFooter />
        </Layout>
      </BackendAPIProvider>
    );

  return (
    <BackendAPIProvider>
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
            <ToastContainer position="top-center" hideProgressBar closeOnClick autoClose={3000} />
          </Content>
          <AppFooter />
        </Layout>
      </Layout>
    </BackendAPIProvider>
  );
}

export default App;
