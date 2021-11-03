import React from "react";
import { Layout } from "antd";

const { Footer } = Layout;

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
const AppFooter = () => {
  return (
    <Footer style={{ textAlign: "center", height: "40px", paddingTop: "7px" }}>
      Copyright &copy; 2021 Daifuku Mechatronics (Singapore) Pte. Ltd. All Rights Reserved.
    </Footer>
  );
};

export default AppFooter;
