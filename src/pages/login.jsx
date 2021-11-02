import React from "react";
import { Form, Button, Input, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useHistory } from "react-router-dom";
import { withStyles } from "@mui/styles";
import { ROUTE_DASHBORAD } from "./../util/constants";
import loginlogo from "../logo-login.png";
import wallpaper from "../wallpaper.jpeg";

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    width: "100%",
    height: "100vh",
    //* color background
    // background: "#172a3d",
  },
  container: {
    width: "400px",
    height: "420px",
    borderRadius: "20px",
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
    letterSpacing: "1px",
  },
};

//-------------------------------------------------------------
//* PAGE START
//-------------------------------------------------------------
const Login = ({ classes }) => {
  const history = useHistory();
  const onFinish = (values) => {
    if (values.userid === "oms" && values.password === "oms") {
      localStorage.setItem("oms-userid", values.userid);
      localStorage.setItem("oms-username", "DMS IS Team DEV");
      history.push(ROUTE_DASHBORAD);
    }
  };

  return (
    <div className={classes.root} style={{ backgroundImage: `url(${wallpaper})`, backgroundSize: "100% 100%" }}>
      <div className={classes.container}>
        <img src={loginlogo} alt="logo" className={classes.logo}></img>
        <Form name="normal_login" initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item name="userid" rules={[{ required: true, message: "Please input your User ID!" }]}>
            <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="User ID" size="large" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="Password"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <a className={classes.forgetPassord} href="/">
              Forgot password
            </a>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className={classes.loginButton} size="large">
              LOGIN
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default withStyles(styles)(Login);
