import React, { useState } from "react";
import { withStyles } from "@mui/styles";
import { Nav, Sidenav } from "rsuite";
import Dropdown from "rsuite/Dropdown";
import { Row, Tabs } from "antd";
import useWindowDimensions from "../../../hooks/useWindowDimensions";

const { TabPane } = Tabs;

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
  list: {
    width: 200,
    overflowY: "scroll",
    border: "1px solid #F0F0F0",
    "&::-webkit-scrollbar": {
      width: 8,
    },
    "&::-webkit-scrollbar-track": {
      background: "#F0F0F0",
      borderRadius: 10,
    },
    "&::-webkit-scrollbar-thumb": {
      background: "#888",
      borderRadius: 10,
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "#555",
    },
  },
  tabs: {
    marginLeft: 5,
  },
};

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------

function ExplorerTab({ classes }) {
  const [table, setTable] = useState(null);
  const { height } = useWindowDimensions();

  const DropdownItem = (props) => (
    <Dropdown.Item
      {...props}
      style={{
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        fontSize: "0.8rem",
      }}
      onClick={() => setTable(props.eventKey)}
    />
  );

  return (
    <div className={classes.root}>
      <Row>
        <div className={classes.list} style={{ height: height - 176 }}>
          <Sidenav activeKey={table}>
            <Sidenav.Body>
              <Nav>
                <DropdownItem eventKey="DMITEM">DMITEM</DropdownItem>
                <DropdownItem eventKey="DNSTOCK">DNSTOCK</DropdownItem>
                <DropdownItem eventKey="DNPALLET">DNPALLET</DropdownItem>
                <DropdownItem eventKey="DMSHELFAGC">DMSHELFAGC</DropdownItem>
                <DropdownItem eventKey="DNRESOURCEKVS">DNRESOURCEKVS</DropdownItem>
                <DropdownItem eventKey="DNGADGETVALUES">DNGADGETVALUES</DropdownItem>
                <DropdownItem eventKey="DNSYSTEMKVS">DNSYSTEMKVS</DropdownItem>
                <DropdownItem eventKey="DMHOSTDATADEFINE">DMHOSTDATADEFINE</DropdownItem>
                <DropdownItem eventKey="DCMENU">DCMENU</DropdownItem>
                <DropdownItem eventKey="DCMENUCONTENT">DCMENUCONTENT</DropdownItem>
                <DropdownItem eventKey="DCMESSAGERECEIVER">DCMESSAGERECEIVER</DropdownItem>
                <DropdownItem eventKey="DMORDERLIMIT">DMORDERLIMIT</DropdownItem>
                <DropdownItem eventKey="DMROUTE">DMROUTE</DropdownItem>
                <DropdownItem eventKey="DNSTATUSCHANGERULE">DNSTATUSCHANGERULE</DropdownItem>
                <DropdownItem eventKey="DMDEVICE">DMDEVICE</DropdownItem>
                <DropdownItem eventKey="DMLAMP">DMLAMP</DropdownItem>
                <DropdownItem eventKey="DMSOFTZONEPRIORITYAGC">DMSOFTZONEPRIORITYAGC</DropdownItem>
                <DropdownItem eventKey="DNPULLDOWNKVS">DNPULLDOWNKVS</DropdownItem>
                <DropdownItem eventKey="DNEVENTHISTORY">DNEVENTHISTORY</DropdownItem>
                <DropdownItem eventKey="DCROLE">DCROLE</DropdownItem>
                <DropdownItem eventKey="DMREPDEVICE">DMREPDEVICE</DropdownItem>
                <DropdownItem eventKey="DMHARDSIZEAGC">DMHARDSIZEAGC</DropdownItem>
                <DropdownItem eventKey="DNHOSTCOMMHISTORY">DNHOSTCOMMHISTORY</DropdownItem>
                <DropdownItem eventKey="DNHOSTDATAERROR">DNHOSTDATAERROR</DropdownItem>
                <DropdownItem eventKey="DCBASE">DCBASE</DropdownItem>
                <DropdownItem eventKey="DMPALLETIZATIONLINE">DMPALLETIZATIONLINE</DropdownItem>
                <DropdownItem eventKey="DNHOSTCOMMSENDHEADER">DNHOSTCOMMSENDHEADER</DropdownItem>
                <DropdownItem eventKey="DNHOSTCOMMSENDDETAIL">DNHOSTCOMMSENDDETAIL</DropdownItem>
              </Nav>
            </Sidenav.Body>
          </Sidenav>
        </div>
        <div className={classes.tabs}>
          <Tabs type="card">
            <TabPane tab={<span>Columns</span>} key={"Columns"}></TabPane>
            <TabPane tab={<span>SQL Source</span>} key={"SQL Source"}></TabPane>
            <TabPane tab={<span>Data</span>} key={"Data"}></TabPane>
            <TabPane tab={<span>Indexes</span>} key={"Indexes"}></TabPane>
          </Tabs>
        </div>
      </Row>
    </div>
  );
}

export default withStyles(styles)(ExplorerTab);
