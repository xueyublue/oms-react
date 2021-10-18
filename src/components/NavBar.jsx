import React, { useState } from "react";
import { useLocation } from "react-router-dom";

import "antd/dist/antd.css";
import { Layout, Menu, Switch } from "antd";
import { MdDarkMode } from "react-icons/md";
import { FcComboChart, FcMindMap, FcBusinessman, FcOrgUnit, FcDatabase } from "react-icons/fc";

import * as Constants from "../util/constants";
import { Link } from "react-router-dom";
import logolight from "../logo-light.png";
import logodark from "../logo-dark.png";

const { SubMenu } = Menu;
const { Sider } = Layout;

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
const NavBar = () => {
  const [selectedKeys, setSelectedKeys] = useState("dashboard");
  const [openKeys, setOpenKeys] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const { pathname } = useLocation();
  if (pathname !== selectedKeys) setSelectedKeys(pathname);
  if (!openKeys && pathname) {
    const lastIndex = pathname.lastIndexOf("/");
    if (lastIndex !== 0) setOpenKeys(pathname.substr(0, pathname.lastIndexOf("/")));
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
      <div style={{ height: "32px", margin: "16px", textAlign: "center" }}>
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
        <Menu.Item key={Constants.ROUTE_DASHBORAD} icon={<FcOrgUnit size={20} />}>
          <Link to={Constants.ROUTE_DASHBORAD}>Dashboard</Link>
        </Menu.Item>

        <SubMenu key="/instance" icon={<FcMindMap size={20} />} title="Instance">
          <Menu.Item key={Constants.ROUTE_INSTANCE_DETAILS}>
            <Link to={Constants.ROUTE_INSTANCE_DETAILS}>Details</Link>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_INSTANCE_SGA}>
            <Link to={Constants.ROUTE_INSTANCE_SGA}>SGA</Link>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_INSTANCE_BANNERS}>
            <Link to={Constants.ROUTE_INSTANCE_BANNERS}>Banners</Link>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_INSTANCE_RESOURCE_LIMIT}>
            <Link to={Constants.ROUTE_INSTANCE_RESOURCE_LIMIT}>Resource Limit</Link>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_INSTANCE_PARAMETERS}>
            <Link to={Constants.ROUTE_INSTANCE_PARAMETERS}>Parameters</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="/performance" icon={<FcComboChart size={20} />} title="Performance">
          <Menu.Item key={Constants.ROUTE_PERFORMANCE_SESSION}>
            <Link to={Constants.ROUTE_PERFORMANCE_SESSION}>Session</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="/space" icon={<FcDatabase size={20} />} title="Space">
          <Menu.Item key={Constants.ROUTE_SPACE_TABLESPACE}>
            <Link to={Constants.ROUTE_SPACE_TABLESPACE}>Tablespace</Link>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_SPACE_TOP_TABLES}>
            <Link to={Constants.ROUTE_SPACE_TOP_TABLES}>Top Tables</Link>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_SPACE_TOP_INDEXES}>
            <Link to={Constants.ROUTE_SPACE_TOP_INDEXES}>Top Indexes</Link>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_SPACE_TABLE_RECORDS}>
            <Link to={Constants.ROUTE_SPACE_TABLE_RECORDS}>Table Records</Link>
          </Menu.Item>
        </SubMenu>

        <SubMenu key="/user" icon={<FcBusinessman size={20} />} title="User">
          <Menu.Item key={Constants.ROUTE_USER_PROFILES}>
            <Link to={Constants.ROUTE_USER_PROFILES}>Profiles</Link>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_USER_ROLES}>
            <Link to={Constants.ROUTE_USER_ROLES}>Roles</Link>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_USER_ROLE_PRIVILEGES}>
            <Link to={Constants.ROUTE_USER_ROLE_PRIVILEGES}>Role Privileges</Link>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_USER_USERS}>
            <Link to={Constants.ROUTE_USER_USERS}>Users</Link>
          </Menu.Item>
          <Menu.Item key={Constants.ROUTE_USER_USER_PRIVILEGES}>
            <Link to={Constants.ROUTE_USER_USER_PRIVILEGES}>User Privileges</Link>
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
