import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Layout, Row, Col, Button, Dropdown, Menu, Modal, Badge, Alert } from "antd";
import { UserOutlined, BellOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { FcBusinessman, FcSettings } from "react-icons/fc";
import { RiLogoutBoxRLine } from "react-icons/ri";
import jwtDecode from "jwt-decode";
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
    else if (e.key === "settings") history.push(Constants.ROUTE_SYSTEM_SETTINGS);
    else if (e.key === "logout") setLogoutModalVisiable(true);
  };

  const notifications = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="1">
        <Alert message="I am a testing message. No action required." type="warning" showIcon />
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

  const token = localStorage.getItem("omsToken");

  return (
    <Header className="site-layout-background" style={{ paddingLeft: 16 }}>
      <Row justify="start">
        <Col span={12}>
          <strong style={{ fontSize: "1.25rem" }}>{pageName}</strong>
        </Col>
        <Col span={12} style={{ textAlign: "right" }}>
          <Button type="text" icon={<QuestionCircleOutlined />} />
          <Dropdown overlay={notifications}>
            <Badge size="small" count={1} offset={[-4, 8]}>
              <Button type="text" icon={<BellOutlined />} />
            </Badge>
          </Dropdown>
          <Dropdown overlay={userMenu}>
            <Button type="text" icon={<UserOutlined />}>
              {token && jwtDecode(token).userName}
            </Button>
          </Dropdown>
        </Col>
      </Row>
      <Modal
        title="Confirmation"
        visible={logoutModalVisiable}
        onOk={() => {
          setLogoutModalVisiable(false);
          localStorage.removeItem("omsToken");
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
