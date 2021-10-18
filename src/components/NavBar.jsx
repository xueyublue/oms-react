import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import "antd/dist/antd.css";
import { Layout, Menu, Switch } from "antd";
import { MdDarkMode } from "react-icons/md";
import {
  FcComboChart,
  FcMindMap,
  FcBusinessman,
  FcOrgUnit,
  FcDatabase,
} from "react-icons/fc";

import * as Constants from "../util/constants";
import { Route, Link, Switch as ReactSwitch } from "react-router-dom";
import logolight from "../logo-light.png";
import logodark from "../logo-dark.png";

const { SubMenu } = Menu;
const { Sider } = Layout;

const NavBar = () => {
  const [selectedKeys, setSelectedKeys] = useState("dashboard");
  const [openKeys, setOpenKeys] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const { pathname } = useLocation();
  if (pathname !== selectedKeys) setSelectedKeys(pathname);
  if (!openKeys && pathname) {
    const lastIndex = pathname.lastIndexOf("/");
    if (lastIndex !== 0)
      setOpenKeys(pathname.substr(0, pathname.lastIndexOf("/")));
  }

  const siderStyle = darkMode
    ? {
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
      }
    : {
        overflow: "auto",
        height: "100vh",
        position: "fixed",
        left: 0,
        backgroundColor: "white",
      };
  const logo = darkMode ? logodark : logolight;
  const menuTheme = darkMode ? "dark" : "";

  return (
    <Sider style={siderStyle} width={220}>
      <div className="logo">
        <img src={logo} alt="me" style={{ height: 32, width: 180 }} />
      </div>
      <Menu
        theme={menuTheme}
        mode="inline"
        selectedKeys={[selectedKeys]}
        defaultSelectedKeys={["dashboard"]}
        openKeys={[openKeys]}
        onClick={(e) => {
          setSelectedKeys(e.key);
        }}
        onOpenChange={(oKeys) => {
          if (oKeys.length >= 1) {
            setOpenKeys(oKeys[oKeys.length - 1]);
          } else {
            setOpenKeys("dashboard");
          }
        }}
      >
        <Menu.Item
          key={Constants.ROUTE_DASHBORAD}
          icon={<FcOrgUnit size={20} />}
        >
          <Link to={Constants.ROUTE_DASHBORAD}>Dashboard</Link>
        </Menu.Item>

        <SubMenu
          key="/instance"
          icon={<FcMindMap size={20} />}
          title="Instance"
        >
          <Menu.Item key={Constants.ROUTE_INSTANCE_DETAILS}>
            <Link to={Constants.ROUTE_INSTANCE_DETAILS}>Details</Link>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_INSTANCE_SGA}>
            <Route href={Constants.ROUTE_INSTANCE_SGA}>SGA</Route>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_INSTANCE_BANNERS}>
            <Route href={Constants.ROUTE_INSTANCE_BANNERS}>Banners</Route>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_INSTANCE_RESOURCE_LIMIT}>
            <Route href={Constants.ROUTE_INSTANCE_RESOURCE_LIMIT}>
              Resource Limit
            </Route>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_INSTANCE_PARAMETERS}>
            <Route href={Constants.ROUTE_INSTANCE_PARAMETERS}>Parameters</Route>
          </Menu.Item>
        </SubMenu>

        <SubMenu
          key="/performance"
          icon={<FcComboChart size={20} />}
          title="Performance"
        >
          <Menu.Item key={Constants.ROUTE_PERFORMANCE_SESSION}>
            <Route href={Constants.ROUTE_PERFORMANCE_SESSION}>Session</Route>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="/space" icon={<FcDatabase size={20} />} title="Space">
          <Menu.Item key={Constants.ROUTE_SPACE_TABLESPACE}>
            <Route href={Constants.ROUTE_SPACE_TABLESPACE}>Tablespace</Route>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_SPACE_TOP_TABLES}>
            <Route href={Constants.ROUTE_SPACE_TOP_TABLES}>Top Tables</Route>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_SPACE_TOP_INDEXES}>
            <Route href={Constants.ROUTE_SPACE_TOP_INDEXES}>Top Indexes</Route>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_SPACE_TABLE_RECORDS}>
            <Route href={Constants.ROUTE_SPACE_TABLE_RECORDS}>
              Table Records
            </Route>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="/user" icon={<FcBusinessman size={20} />} title="User">
          <Menu.Item key={Constants.ROUTE_USER_PROFILES}>
            <Route href={Constants.ROUTE_USER_PROFILES}>Profiles</Route>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_USER_ROLES}>
            <Route href={Constants.ROUTE_USER_ROLES}>Roles</Route>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_USER_ROLE_PRIVILEGES}>
            <Route href={Constants.ROUTE_USER_ROLE_PRIVILEGES}>
              Role Privileges
            </Route>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_USER_USERS}>
            <Route href={Constants.ROUTE_USER_USERS}>Users</Route>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_USER_USER_PRIVILEGES}>
            <Route href={Constants.ROUTE_USER_USER_PRIVILEGES}>
              User Privileges
            </Route>
          </Menu.Item>
        </SubMenu>
      </Menu>
      <div style={{ position: "fixed", bottom: 10, left: 90 }}>
        <Switch
          checkedChildren={<MdDarkMode />}
          unCheckedChildren={<MdDarkMode />}
          onChange={(mode) => {
            setDarkMode(mode);
          }}
        />
      </div>
    </Sider>
  );
};

export default NavBar;
