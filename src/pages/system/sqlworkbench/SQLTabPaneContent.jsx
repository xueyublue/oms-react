import React from "react";
import { Table, Input } from "antd";
import { withStyles } from "@mui/styles";

const { Search } = Input;

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    width: "100%",
    marginTop: "-10px",
  },
  table: {
    marginTop: "10px",
  },
};

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
function SQLTabPaneContent({ classes }) {
  return (
    <div className={classes.root}>
      <Search placeholder="Intelligent SQL Inputter" allowClear enterButton size="middle" />
      <Table className={classes.table} />
    </div>
  );
}

export default withStyles(styles)(SQLTabPaneContent);
