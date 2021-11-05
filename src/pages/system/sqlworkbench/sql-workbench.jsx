import React, { useState } from "react";
import { Tabs, Table, Input } from "antd";
import { MenuOutlined, FileSearchOutlined } from "@ant-design/icons";
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
// PAGE START
//-------------------------------------------------------------
const SQLWorkbench = ({ classes }) => {
  const [activeKey, setActiveKey] = useState(1);
  const handleChange = () => {};
  const handleEdit = () => {};

  return (
    <div className={classes.root}>
      <Tabs type="editable-card">
        <TabPane
          tab={
            <span>
              <MenuOutlined />
              Explorer
            </span>
          }
          key={1}
        >
          <Table style={{ marginTop: "-15px" }} />
        </TabPane>
        <TabPane
          tab={
            <span>
              <MenuOutlined />
              Explorer
            </span>
          }
          key={2}
        >
          <Table style={{ marginTop: "-15px" }} />
        </TabPane>
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
      </Tabs>
    </div>
  );
};

export default withStyles(styles)(SQLWorkbench);
