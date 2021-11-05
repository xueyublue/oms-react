import React from "react";
import { Table, AutoComplete, Tabs, Input } from "antd";
import { withStyles } from "@mui/styles";

const { TabPane } = Tabs;

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    width: "100%",
    marginTop: "-10px",
  },
  input: {
    width: "100%",
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
      <AutoComplete className={classes.input}>
        <Input.Search placeholder="Intelligent SQL Inputter" allowClear enterButton size="middle" />
      </AutoComplete>
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
