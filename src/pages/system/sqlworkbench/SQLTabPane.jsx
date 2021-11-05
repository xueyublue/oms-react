import React, { useState } from "react";
import { Tabs, Table, Input } from "antd";
import { FileSearchOutlined } from "@ant-design/icons";
import { withStyles } from "@mui/styles";

const { TabPane } = Tabs;
const { Search } = Input;

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    width: "100%",
  },
};

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
function SQLTabPane({ classes }) {
  return (
    <TabPane
      tab={
        <span>
          <FileSearchOutlined />
          SQL
        </span>
      }
      key={3}
    >
      <div style={{ width: "100%", marginTop: "-10px" }}>
        <Search placeholder="Intelligent SQL Inputter" allowClear enterButton size="middle" />
        <Table style={{ marginTop: "10px" }} />
      </div>
    </TabPane>
  );
}

export default withStyles(styles)(SQLTabPane);
