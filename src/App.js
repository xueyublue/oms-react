import { useLocation, useHistory } from "react-router-dom";
import { useState } from "react";
import { Layout } from "antd";
import "rsuite/dist/rsuite.min.css";
import "antd/dist/antd.css";
import { withStyles } from "@mui/styles";
import NavBar from "./components/NavBar";
import AppBar from "./components/AppBar";
import AppFooter from "./components/AppFooter";
import { RouteToPageName } from "./util/constants";
import RouteContainer from "./components/RouteContainer";
import { ROUTE_LOGIN, ROUTE_DASHBORAD, ROUTE_ROOT } from "./util/constants";
import { BackendAPIProvider } from "./context/BackendAPIContext";
import classNames from "classnames";

const { Content } = Layout;

//-------------------------------------------------------------
// STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    background: "#fff",
  },
  main: {
    marginLeft: 220,
    minHeight: "100vh",
  },
  appbar: {
    margin: "0 5px",
  },
  container: {
    margin: "5px",
    padding: 8,
    minHeight: 500,
  },
  loginContainer: {
    minHeight: "100vh",
  },
};

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
function App({ classes }) {
  const history = useHistory();
  const userId = localStorage.getItem("oms-userid");
  const username = localStorage.getItem("oms-username");
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

  // redirect routes to dashbaord
  if (pathname === "/" || pathname === ROUTE_ROOT || pathname === `${ROUTE_ROOT}/home`) {
    history.push(ROUTE_DASHBORAD);
    return null;
  }

  // no navigation bars for login pages
  if (pageWithoutNavigation)
    return (
      <BackendAPIProvider>
        <Layout className="site-layout">
          <Content className={classNames("site-layout-background", classes.loginContainer)}>
            <RouteContainer />
          </Content>
        </Layout>
      </BackendAPIProvider>
    );

  return (
    <BackendAPIProvider>
      <Layout className="site-layout">
        <NavBar />
        <Layout className={classes.main}>
          <div className={classes.appbar}>
            <AppBar pageName={RouteToPageName(pathname)} />
          </div>
          <Content className={classNames("site-layout-background", classes.container)}>
            <RouteContainer />
          </Content>
          <AppFooter />
        </Layout>
      </Layout>
    </BackendAPIProvider>
  );
}

export default withStyles(styles)(App);
