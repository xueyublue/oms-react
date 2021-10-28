import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { List, Card, Tag, Row, Col } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { withStyles } from "@mui/styles";
import Loading from "../components/Loading";
import ApiCallFailed from "../components/ApiCallFailed";
import { BackendAPIContext } from "../context/BackendAPIContext";
import * as Constants from "../util/constants";
import { API_FETCH_WAIT } from "../util/constants";
import HostResourceLineChart from "../components/chart/HostResourceLineChart";
import TablespaceBarChart from "../components/chart/TablespaceBarChart";

//-------------------------------------------------------------
// STYLES START
//-------------------------------------------------------------
const styles = {
  root: {},
};

const tagStyle = { fontSize: "1rem", padding: 10, width: "100%" };
const tagStyle2 = { fontSize: "1rem", padding: 10, width: "48%" };
const tagStyle3 = { fontSize: "1rem", padding: 10, width: "31%" };
const buildListDataSource = (data, history) => [
  {
    title: "Instance Status",
    content: (
      <Tag icon={<CheckCircleOutlined />} color="success" style={tagStyle}>
        {data.instanceStatus}
      </Tag>
    ),
  },
  {
    title: "SGA Occupancy",
    content: (
      <Tag
        icon={data.sga >= 80 ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
        color={data.sga >= 80 ? "error" : "success"}
        style={tagStyle}
      >
        {data.sga}%
      </Tag>
    ),
    handleClick: () => {
      history.push(Constants.ROUTE_INSTANCE_SGA);
    },
  },
  {
    title: "Alerts",
    content: (
      <Tag
        icon={data.alerts === 0 ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
        color={data.alerts === 0 ? "success" : "error"}
        style={tagStyle}
      >
        {data.alerts} Alerts
      </Tag>
    ),
  },
  {
    title: "Sessions",
    content: (
      <div>
        <Tag color="success" style={tagStyle2}>
          {data.sessions.active} Active
        </Tag>
        <Tag color={data.sessions.inactive === 0 ? "success" : "warning"} style={tagStyle2}>
          {data.sessions.inactive} Inactive
        </Tag>
      </div>
    ),
    handleClick: () => {
      history.push(Constants.ROUTE_PERFORMANCE_SESSION);
    },
  },
  {
    title: "Table Records",
    content: (
      <div>
        <Tag color="success" style={tagStyle2}>
          {data.tableRecords.normal} Normal
        </Tag>
        <Tag color={data.tableRecords.high === 0 ? "success" : "error"} style={tagStyle2}>
          {data.tableRecords.high} High
        </Tag>
      </div>
    ),
    handleClick: () => {
      history.push(Constants.ROUTE_SPACE_TABLE_RECORDS);
    },
  },
  {
    title: "Host Storage",
    content: (
      <div>
        {data.hostStorage.map((item) => (
          <Tag color={item.occupancy >= 80 ? "error" : "success"} style={tagStyle3} key={item.driveLetter}>
            {item.driveLetter} {item.occupancy}%
          </Tag>
        ))}
      </div>
    ),
    handleClick: () => {
      history.push(Constants.ROUTE_SPACE_TABLE_RECORDS);
    },
  },
];

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Dashboard = ({ classes }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const history = useHistory();

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/dashboard`)
        .then(({ data }) => {
          setData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setData(null);
          setIsLoading(false);
          console.log(err);
        });
    }, API_FETCH_WAIT);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, API_FETCH_WAIT);
    return () => clearInterval(interval);
  }, [baseUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  const listDataSource = buildListDataSource(data, history);

  return (
    <div className={classes.root}>
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 2,
          xl: 2,
          xxl: 3,
        }}
        dataSource={listDataSource}
        renderItem={(item) => (
          <List.Item>
            <Card title={item.title} onClick={item.handleClick} style={{ textAlign: "center" }}>
              {item.content}
            </Card>
          </List.Item>
        )}
      />
      <Row>
        <Col xl={24} xxl={12}>
          <HostResourceLineChart
            labels={data.hostResource.label}
            cpu={data.hostResource.cpu}
            ram={data.hostResource.ram}
          />
        </Col>
        <Col xl={24} xxl={12}>
          <TablespaceBarChart labels={data.tablespace.label} data={data.tablespace.data} />
        </Col>
      </Row>
    </div>
  );
};

export default withStyles(styles)(Dashboard);
