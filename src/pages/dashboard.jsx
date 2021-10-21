import React, { useState, useEffect, useContext } from "react";
import { useHistory } from "react-router-dom";
import { List, Card, Tag } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import Loading from "../components/Loading";
import ApiCallFailed from "../components/ApiCallFailed";
import { BackendAPIContext } from "../context/BackendAPIContext";
import * as Constants from "../util/constants";

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const tagStyle = { fontSize: 14, padding: 6, width: "100%" };
  const tagStyle2 = { fontSize: 14, padding: 6, width: "46%" };
  const tagStyle3 = { fontSize: 14, padding: 6, width: "30%" };
  const history = useHistory();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/dashboard`);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        setData(null);
        setIsLoading(false);
      }
    };
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [baseUrl]);

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;

  const dataSource = [
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
      title: "Tablespace Occupancy",
      content: (
        <div>
          <Tag color="success" style={tagStyle2}>
            {data.tablespace.normal} Normal
          </Tag>
          <Tag color={data.tablespace.high === 0 ? "success" : "error"} style={tagStyle2}>
            {data.tablespace.high} High
          </Tag>
        </div>
      ),
      handleClick: () => {
        history.push(Constants.ROUTE_SPACE_TABLESPACE);
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
      title: "Host Resource",
      content: (
        <div>
          <Tag color={data.hostResource.cpu >= 80 ? "error" : "success"} style={tagStyle2}>
            CPU {data.hostResource.cpu}%
          </Tag>
          <Tag color={data.hostResource.ram >= 80 ? "error" : "success"} style={tagStyle2}>
            RAM {data.hostResource.ram}%
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
            <Tag color={item.occupancy >= 80 ? "error" : "success"} style={tagStyle3}>
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

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 3,
        xxl: 4,
      }}
      dataSource={dataSource}
      renderItem={(item) => (
        <List.Item>
          <Card title={item.title} onClick={item.handleClick} style={{ textAlign: "center" }}>
            {item.content}
          </Card>
        </List.Item>
      )}
    />
  );
};

export default Dashboard;
