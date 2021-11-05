import React from "react";
import { Table, Input, Tabs } from "antd";
import { withStyles } from "@mui/styles";

const { TabPane } = Tabs;
const { Search } = Input;

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    width: "100%",
    marginTop: "-10px",
  },
  result: {
    marginTop: "5px",
  },
  table: {
    marginTop: "-15px",
  },
};

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
function SQLTabPaneContent({ classes }) {
  return (
    <div className={classes.root}>
      <Search placeholder="Intelligent SQL Inputter" allowClear enterButton size="middle" />
      <div className={classes.result}>
        <Tabs type="card">
          <TabPane closable={false} tab={"Result"} key={"1"}>
            <Table className={classes.table} />
          </TabPane>
          <TabPane closable={false} tab={"Result"} key={"2"}>
            <Table className={classes.table} />
          </TabPane>
          <TabPane closable={false} tab={"Result"} key={"3"}>
            <Table className={classes.table} />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default withStyles(styles)(SQLTabPaneContent);
