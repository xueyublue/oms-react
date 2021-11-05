import React from "react";
import { Table } from "antd";
import { withStyles } from "@mui/styles";

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
function ExplorerTabPaneContent({ classes }) {
  return (
    <div className={classes.root}>
      <Table className={classes.table} />
    </div>
  );
}

export default withStyles(styles)(ExplorerTabPaneContent);
