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
  const [activeKey, setActiveKey] = useState("2");
  const handleEdit = () => {};
  const handleTabChange = (value) => setActiveKey(value);

  return (
    <div className={classes.root}>
      <Tabs type="editable-card" activeKey={activeKey} onChange={handleTabChange}>
        <TabPane
          closable={false}
          tab={
            <span>
              <MenuOutlined />
              Explorer
            </span>
          }
          key={"1"}
        >
          <ExplorerTabPaneContent />
        </TabPane>
        <TabPane
          closable={false}
          tab={
            <span>
              <FileSearchOutlined />
              SQL
            </span>
          }
          key={"2"}
        >
          <SQLTabPaneContent />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default withStyles(styles)(SQLWorkbench);
