import React, { useState } from "react";
import { Tabs } from "antd";
import { MenuOutlined, FileSearchOutlined } from "@ant-design/icons";
import { withStyles } from "@mui/styles";
import SQLTabPaneContent from "./SQLTabPaneContent";
import ExplorerTabPaneContent from "./ExplorerTabPaneContent";

const { TabPane } = Tabs;

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
          <ExplorerTabPaneContent />
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
          <ExplorerTabPaneContent />
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
          <SQLTabPaneContent />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default withStyles(styles)(SQLWorkbench);
