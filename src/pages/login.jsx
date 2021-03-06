import React, { useState, useContext } from "react";
import { Form, Button, Input, Checkbox, Typography } from "antd";
import { UserOutlined, LockOutlined, LoadingOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { withStyles } from "@mui/styles";
import axios from "axios";
import { useSpring, animated } from "react-spring";

import { ROUTE_DASHBORAD } from "./../util/constants";
import loginlogo from "../logo-login.png";
import wallpaper from "../wallpaper.jpeg";
import { BackendAPIContext } from "./../context/BackendAPIContext";

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    width: "100%",
    height: "100vh",
  },
  container: {
    width: "400px",
    height: "420px",
    borderRadius: "10px",
    background: "#F2F2F2",
    color: "#fff",
    top: "50%",
    left: "50%",
    position: "absolute",
    transform: "translate(-50%, -50%)",
    boxSizing: "border-box",
    padding: "70px 30px",
  },
  logo: {
    width: "220px",
    height: "40px",
    position: "absolute",
    top: "15px",
    left: "calc(50% - 110px)",
  },
  forgetPassord: {
    float: "right",
  },
  loginButton: {
    width: "100%",
    fontWeight: 600,
    letterSpacing: "1.25px",
  },
  messageContainer: {
    marginTop: 10,
  },
  message: {
    color: "purple",
  },
  footer: {
    color: "gray",
    fontSize: "12px",
    textAlign: "center",
    width: "340px",
    position: "absolute",
    bottom: "20px",
    left: "calc(50% - 170px)",
  },
};

//-------------------------------------------------------------
//* PAGE START
//-------------------------------------------------------------
const Login = ({ classes }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const history = useHistory();
  const spring = useSpring({ from: { opacity: 0.6 }, to: { opacity: 1 }, config: { duration: 500 } });

  const onFinish = (values) => {
    setAuthStatus(null);
    setIsAuthenticating(true);
    setTimeout(() => {
      process.env.REACT_APP_COMM_WITH_JSON_SERVER === "FALSE"
        ? axios
            .post(`${baseUrl}/auth/login`, { userId: values.userid, password: values.password })
            .then(({ data }) => {
              setIsAuthenticating(false);
              if (data.success) {
                setAuthStatus("S");
                localStorage.setItem("omsToken", data.omsToken);
                history.push(ROUTE_DASHBORAD);
              } else setAuthStatus("F");
            })
            .catch((err) => {
              setAuthStatus("F");
              setIsAuthenticating(false);
              console.log(err);
            })
        : axios
            .get(`${baseUrl}/auth/login`, { userId: values.userid, password: values.password })
            .then(({ data }) => {
              setIsAuthenticating(false);
              if (data.success) {
                setAuthStatus("S");
                localStorage.setItem("omsToken", data.omsToken);
                history.push(ROUTE_DASHBORAD);
              } else setAuthStatus("F");
            })
            .catch((err) => {
              setAuthStatus("F");
              setIsAuthenticating(false);
              console.log(err);
            });
    }, 2000);
  };

  return (
    <animated.div style={spring}>
      <div className={classes.root} style={{ backgroundImage: `url(${wallpaper})`, backgroundSize: "100% 100%" }}>
        <div className={classes.container}>
          <img src={loginlogo} alt="logo" className={classes.logo}></img>
          <Form name="normal_login" initialValues={{ remember: true }} onFinish={onFinish}>
            <Form.Item name="userid" rules={[{ required: true, message: "Please input your User ID!" }]}>
              <Input
                disabled={isAuthenticating}
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="User ID"
                size="large"
              />
            </Form.Item>
            <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
              <Input
                disabled={isAuthenticating}
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="Password"
                size="large"
              />
            </Form.Item>
            <Form.Item>
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox disabled={isAuthenticating}>Remember me</Checkbox>
              </Form.Item>
              {/* <a className={classes.forgetPassord} href="/">
              Forgot password
            </a> */}
            </Form.Item>
            <Form.Item>
              <Button
                disabled={isAuthenticating}
                type="primary"
                htmlType="submit"
                className={classes.loginButton}
                size="large"
              >
                {isAuthenticating && <LoadingOutlined />} LOGIN
              </Button>
              <div className={classes.messageContainer}>
                {authStatus === "F" && (
                  <Typography.Text type="danger" strong>
                    Invalid User ID or Password!
                  </Typography.Text>
                )}
              </div>
            </Form.Item>
            <div className={classes.footer}>
              Copyright &copy; 2021 Daifuku Mechatronics (Singapore) Pte. Ltd. All Rights Reserved.
            </div>
          </Form>
        </div>
      </div>
    </animated.div>
  );
};

export default withStyles(styles)(Login);
