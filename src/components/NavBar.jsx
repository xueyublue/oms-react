import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Layout, Menu, Switch } from "antd";
import { MdWbSunny, MdDarkMode } from "react-icons/md";
import { FcComboChart, FcMindMap, FcBusinessman, FcOrgUnit, FcDatabase, FcServices } from "react-icons/fc";
import { withStyles } from "@mui/styles";
import * as Constants from "../util/constants";
import { Link } from "react-router-dom";
import logolight from "../logo-light.png";
import logodark from "../logo-dark.png";

const { SubMenu } = Menu;
const { Sider } = Layout;

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = { root: {} };

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
const MenuItem = (props) => (
  <Menu.Item
    {...props}
    style={{
      paddingLeft: 54,
    }}
  />
);

const NavBar = ({ classes }) => {
  const [selectedKeys, setSelectedKeys] = useState(Constants.ROUTE_DASHBORAD);
  const [openKeys, setOpenKeys] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const { pathname } = useLocation();
  if (pathname !== selectedKeys) setSelectedKeys(pathname);
  if (!openKeys && pathname) {
    const newPathName = pathname.slice(Constants.ROUTE_ROOT.length);
    const lastIndex = newPathName.lastIndexOf("/");
    if (lastIndex !== 0) setOpenKeys(newPathName.substr(0, lastIndex));
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
        style={
          darkMode
            ? { borderRight: "1px solid #011528", transition: "0.5s" }
            : { borderRight: "1px solid white", transition: "0.5s" }
        }
        theme={menuTheme}
        mode="inline"
        selectedKeys={[selectedKeys]}
        defaultSelectedKeys={[Constants.ROUTE_DASHBORAD]}
        openKeys={[openKeys]}
        onClick={(e) => {
          setSelectedKeys(e.key);
        }}
        onOpenChange={(oKeys) => {
          if (oKeys.length >= 1) {
            setOpenKeys(oKeys[oKeys.length - 1]);
          } else {
            setOpenKeys(Constants.ROUTE_DASHBORAD);
          }
        }}
      >
        {/* //* Dashboard */}
        <Menu.Item key={Constants.ROUTE_DASHBORAD} icon={<FcOrgUnit size={20} />}>
          <Link to={Constants.ROUTE_DASHBORAD}>Dashboard</Link>
        </Menu.Item>
        {/* //* Instance */}
        <SubMenu key="/instance" icon={<FcMindMap size={20} />} title="Instance">
          <MenuItem key={Constants.ROUTE_INSTANCE_DETAILS}>
            <Link to={Constants.ROUTE_INSTANCE_DETAILS}>Details</Link>
          </MenuItem>
          <MenuItem key={Constants.ROUTE_INSTANCE_SGA}>
            <Link to={Constants.ROUTE_INSTANCE_SGA}>System Global Area</Link>
          </MenuItem>
          <MenuItem key={Constants.ROUTE_INSTANCE_PARAMETERS}>
            <Link to={Constants.ROUTE_INSTANCE_PARAMETERS}>Parameters</Link>
          </MenuItem>
          <MenuItem key={Constants.ROUTE_INSTANCE_RESOURCE_LIMIT}>
            <Link to={Constants.ROUTE_INSTANCE_RESOURCE_LIMIT}>Resource Limit</Link>
          </MenuItem>
        </SubMenu>
        {/* //* Performance */}
        <SubMenu key="/performance" icon={<FcComboChart size={20} />} title="Performance">
          <MenuItem key={Constants.ROUTE_PERFORMANCE_SESSION}>
            <Link to={Constants.ROUTE_PERFORMANCE_SESSION}>Session</Link>
          </MenuItem>
          <MenuItem key={Constants.ROUTE_PERFORMANCE_HOST}>
            <Link to={Constants.ROUTE_PERFORMANCE_HOST}>Host Resource</Link>
          </MenuItem>
        </SubMenu>
        {/* //* Space */}

        <SubMenu key="/space" icon={<FcDatabase size={20} />} title="Space">
          <MenuItem key={Constants.ROUTE_SPACE_TABLESPACE}>
            <Link to={Constants.ROUTE_SPACE_TABLESPACE}>Tablespace</Link>
          </MenuItem>
          <MenuItem key={Constants.ROUTE_SPACE_TOP_TABLES}>
            <Link to={Constants.ROUTE_SPACE_TOP_TABLES}>Top Tables</Link>
          </MenuItem>
          <MenuItem key={Constants.ROUTE_SPACE_TOP_INDEXES}>
            <Link to={Constants.ROUTE_SPACE_TOP_INDEXES}>Top Indexes</Link>
          </MenuItem>
          <MenuItem key={Constants.ROUTE_SPACE_TABLE_RECORDS}>
            <Link to={Constants.ROUTE_SPACE_TABLE_RECORDS}>Table Records</Link>
          </MenuItem>
        </SubMenu>
        {/* //* User */}
        <SubMenu key="/user" icon={<FcBusinessman size={20} />} title="User">
          <MenuItem key={Constants.ROUTE_USER_PROFILES}>
            <Link to={Constants.ROUTE_USER_PROFILES}>Profiles</Link>
          </MenuItem>
          <MenuItem key={Constants.ROUTE_USER_ROLES}>
            <Link to={Constants.ROUTE_USER_ROLES}>Roles</Link>
          </MenuItem>
          <MenuItem key={Constants.ROUTE_USER_ROLE_PRIVILEGES}>
            <Link to={Constants.ROUTE_USER_ROLE_PRIVILEGES}>Role Privileges</Link>
          </MenuItem>
          <MenuItem key={Constants.ROUTE_USER_USERS}>
            <Link to={Constants.ROUTE_USER_USERS}>Users</Link>
          </MenuItem>
          <MenuItem key={Constants.ROUTE_USER_USER_PRIVILEGES}>
            <Link to={Constants.ROUTE_USER_USER_PRIVILEGES}>User Privileges</Link>
          </MenuItem>
        </SubMenu>
        {/* //* System */}
        <SubMenu key="/system" icon={<FcServices size={20} />} title="System">
          <MenuItem key={Constants.ROUTE_SYSTEM_WORKBENCH}>
            <Link to={Constants.ROUTE_SYSTEM_WORKBENCH}>SQL Workbench</Link>
          </MenuItem>
          <MenuItem key={Constants.ROUTE_SYSTEM_SETTINGS}>
            <Link to={Constants.ROUTE_SYSTEM_SETTINGS}>Settings</Link>
          </MenuItem>
          <MenuItem key={Constants.ROUTE_SYSTEM_ABOUT}>
            <Link to={Constants.ROUTE_SYSTEM_ABOUT}>About</Link>
          </MenuItem>
        </SubMenu>
      </Menu>
      <div style={{ position: "fixed", bottom: 10, left: 90 }}>
        <Switch
          checkedChildren={<MdDarkMode />}
          unCheckedChildren={<MdWbSunny />}
          onChange={(mode) => {
            setDarkMode(mode);
          }}
        />
      </div>
    </Sider>
  );
};

export default withStyles(styles)(NavBar);
