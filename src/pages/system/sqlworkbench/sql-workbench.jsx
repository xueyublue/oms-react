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
  const [sqlTabPaneList, setSqlTabPaneList] = useState([]);
  const [activeKey, setActiveKey] = useState("SQL");
  const [tabIndex, setTabIndex] = useState(1);

  const handleTabChange = (value) => setActiveKey(value);
  const handleTabEdit = (targetKey, action) => {
    if ("add" === action) handleTabAdd();
    if ("remove" === action) handleTabRemove(targetKey);
  };
  const handleTabAdd = () => {
    setSqlTabPaneList([...sqlTabPaneList, { title: "SQL " + tabIndex, key: "SQL" + tabIndex }]);
    setActiveKey("SQL" + tabIndex);
    setTabIndex(tabIndex + 1);
  };
  const handleTabRemove = (targetKey) => {
    const remainingTabs = sqlTabPaneList.filter((tab) => tab.key !== targetKey);
    setSqlTabPaneList(remainingTabs);
    setActiveKey("SQL");
    if (remainingTabs.length === 0) setTabIndex(1);
  };

  return (
    <div className={classes.root}>
      <Tabs type="editable-card" activeKey={activeKey} onChange={handleTabChange} onEdit={handleTabEdit}>
        <TabPane
          closable={false}
          tab={
            <span>
              <MenuOutlined />
              Explorer
            </span>
          }
          key={"EXPLORER"}
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
          key={"SQL"}
        >
          <SQLTabPaneContent />
        </TabPane>
        {sqlTabPaneList &&
          sqlTabPaneList.map((item) => (
            <TabPane
              closable={true}
              tab={
                <span>
                  <FileSearchOutlined />
                  {item.title}
                </span>
              }
              key={item.key}
            >
              <SQLTabPaneContent />
            </TabPane>
          ))}
      </Tabs>
    </div>
  );
};

export default withStyles(styles)(SQLWorkbench);
