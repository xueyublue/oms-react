import React, { useContext, useState, useEffect } from "react";
import { withStyles } from "@mui/styles";
import { Nav, Sidenav } from "rsuite";
import Dropdown from "rsuite/Dropdown";
import { Row, Col, Tabs, Input, Spin } from "antd";
import axios from "axios";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { BackendAPIContext } from "./../../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "./../../../util/constants";

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
  search: {
    width: 201,
    marginBottom: 5,
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
  const [isLoading, setIsLoading] = useState(true);
  const [tables, setTables] = useState([]);
  const [search, setSearch] = useState(null);
  const [table, setTable] = useState(null);
  const { height } = useWindowDimensions();
  const { baseUrl } = useContext(BackendAPIContext);

  const DropdownItem = (props) => (
    <Dropdown.Item
      {...props}
      style={{
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: 4,
        fontSize: "12px",
      }}
      onClick={() => setTable(props.eventKey)}
    />
  );

  const Loading = (props) => (
    <Spin
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "col",
        alignItems: "center",
        justifyContent: "center",
      }}
    />
  );

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/sql/tables`)
        .then(({ data }) => {
          setTables(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setTables(null);
          setIsLoading(false);
          console.log(err);
        });
    }, API_FETCH_WAIT);
  };

  useEffect(() => {
    fetchData();
  }, [baseUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  let filteredTables = search ? tables.filter((row) => row.includes(search)) : tables;

  return (
    <div className={classes.root}>
      <Row>
        <Col>
          <div className={classes.search}>
            <Input.Search
              placeholder="Search"
              allowClear
              value={search}
              onChange={(e) => setSearch(e.target.value.toUpperCase())}
            />
          </div>
          <div className={classes.list} style={{ height: height - 213 }}>
            {isLoading ? (
              <Loading />
            ) : (
              <Sidenav activeKey={table}>
                <Sidenav.Body>
                  <Nav>
                    {filteredTables.map((item) => (
                      <DropdownItem eventKey={item}>{item}</DropdownItem>
                    ))}
                  </Nav>
                </Sidenav.Body>
              </Sidenav>
            )}
          </div>
        </Col>
        {table && (
          <div className={classes.tabs}>
            <Tabs type="card" size="small">
              <TabPane tab={<span>Columns</span>} key={"Columns"}></TabPane>
              <TabPane tab={<span>SQL Source</span>} key={"SQL Source"}></TabPane>
              <TabPane tab={<span>Data</span>} key={"Data"}></TabPane>
              <TabPane tab={<span>Indexes</span>} key={"Indexes"}></TabPane>
            </Tabs>
          </div>
        )}
      </Row>
    </div>
  );
}

export default withStyles(styles)(ExplorerTab);
