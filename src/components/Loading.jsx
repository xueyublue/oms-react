import { Spin } from "antd";
import { withStyles } from "@mui/styles";

//-------------------------------------------------------------
// STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    position: "absolute",
    left: "50%",
    top: "50%",
    marginLeft: ({ withinComponent }) => (withinComponent ? "0" : "110px"),
  },
};

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
const Loading = ({ classes, withinComponent }) => {
  return (
    <div className={classes.root}>
      <Spin size="large" tip="Loading..." />
    </div>
  );
};

export default withStyles(styles)(Loading);
