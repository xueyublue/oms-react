import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Layout, Row, Col, Button, Dropdown, Menu, Modal, Badge, Alert } from "antd";
import { UserOutlined, BellOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { FcBusinessman, FcSettings } from "react-icons/fc";
import { RiLogoutBoxRLine } from "react-icons/ri";
import * as Constants from "../util/constants";

const { Header } = Layout;

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
const AppBar = ({ icon, pageName }) => {
  const [logoutModalVisiable, setLogoutModalVisiable] = useState(false);
  const history = useHistory();

  const handleMenuClick = (e) => {
    if (e.key === "profile") history.push(Constants.ROUTE_PROFILE);
    else if (e.key === "settings") history.push(Constants.ROUTE_SETTINGS);
    else if (e.key === "logout") setLogoutModalVisiable(true);
  };

  const notifications = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">
        <Alert
          message="Occupancy of tablespace [SYSAUX, WMS_LARGE] are more than 80%. Please extend them."
          type="warning"
          showIcon
        />
      </Menu.Item>
      <Menu.Item key="2">
        <Alert message="Host CPU usage more than 80%. Please take necessary actions." type="warning" showIcon />
      </Menu.Item>
      <Menu.Item key="3">
        <Alert message="The setting was made." type="success" showIcon />
      </Menu.Item>
    </Menu>
  );

  const userMenu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="profile" icon={<FcBusinessman size={20} />}>
        Profile
      </Menu.Item>
      <Menu.Item key="settings" icon={<FcSettings size={20} />}>
        Settings
      </Menu.Item>
      <Menu.Item key="logout" icon={<RiLogoutBoxRLine size={20} />}>
        Logout
      </Menu.Item>
    </Menu>
  );

  return (
    <Header className="site-layout-background" style={{ paddingLeft: 16 }}>
      <Row justify="start">
        <Col span={12}>
          <h3>{pageName}</h3>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Button type="text" icon={<QuestionCircleOutlined />} />
          <Dropdown overlay={notifications}>
            <Badge size="small" count={2} offset={[-4, 8]}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
          </Dropdown>
          <Dropdown overlay={userMenu}>
            <Button type="text" icon={<UserOutlined />}>
              {localStorage.getItem("oms-username")}
            </Button>
          </Dropdown>
        </Col>
      </Row>
      <Modal
        title="Confirmation"
        visible={logoutModalVisiable}
        onOk={() => {
          setLogoutModalVisiable(false);
          localStorage.removeItem("oms-userid");
          localStorage.removeItem("oms-username");
          history.push(Constants.ROUTE_LOGIN);
        }}
        onCancel={() => setLogoutModalVisiable(false)}
        okText="Yes"
        cancelText="No"
      >
        Are you sure to logout?
      </Modal>
    </Header>
  );
};

export default AppBar;
