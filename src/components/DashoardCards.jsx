import React from "react";
import { useHistory } from "react-router-dom";
import { List, Card, Tag } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import * as Constants from "../util/constants";

//-------------------------------------------------------------
//* UTILS
//-------------------------------------------------------------
const tagStyle = { fontSize: "1rem", padding: 4, width: "100%" };
const tagStyle2 = { fontSize: "1rem", padding: 4, width: "45%" };
const tagStyle3 = { fontSize: "1rem", padding: 4, width: "30%" };

const buildDataSource = (data, history) => [
  {
    title: "Instance Status",
    content: (
      <Tag icon={<CheckCircleOutlined />} color="success" style={tagStyle}>
        {data.instanceStatus}
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
  },
];

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function DashboardCards({ data }) {
  const history = useHistory();

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 1,
        md: 1,
        lg: 1,
        xl: 2,
        xxl: 4,
      }}
      dataSource={buildDataSource(data, history)}
      renderItem={(item) => (
        <List.Item>
          <Card title={item.title} onClick={item.handleClick} style={{ textAlign: "center" }}>
            {item.content}
          </Card>
        </List.Item>
      )}
    />
  );
}

export default DashboardCards;
