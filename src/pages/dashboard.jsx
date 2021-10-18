import { useHistory } from "react-router-dom";
import { List, Card, Tag } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import * as Constants from "../util/constants";

const Dashboard = () => {
  const tagStyle = { fontSize: 14, padding: 5, width: "100%" };
  const tagStyle2 = { fontSize: 14, padding: 5, width: "46%" };
  const history = useHistory();

  const data = [
    {
      title: "Instance Status",
      content: (
        <Tag icon={<CheckCircleOutlined />} color="success" style={tagStyle}>
          Running
        </Tag>
      ),
    },
    {
      title: "SGA Occupancy",
      content: (
        <Tag icon={<CheckCircleOutlined />} color="success" style={tagStyle}>
          45%
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
            57 Active
          </Tag>
          <Tag color="warning" style={tagStyle2}>
            13 Inactive
          </Tag>
        </div>
      ),
      handleClick: () => {
        history.push(Constants.ROUTE_PERFORMANCE_SESSION);
      },
    },
    {
      title: "Tablespace Occupancy",
      content: (
        <div>
          <Tag color="success" style={tagStyle2}>
            8 Normal
          </Tag>
          <Tag color="error" style={tagStyle2}>
            2 High
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
            1574 Normal
          </Tag>
          <Tag color="error" style={tagStyle2}>
            36 High
          </Tag>
        </div>
      ),
      handleClick: () => {
        history.push(Constants.ROUTE_SPACE_TABLE_RECORDS);
      },
    },
    {
      title: "Alerts",
      content: (
        <Tag
          icon={<ExclamationCircleOutlined />}
          color="error"
          style={tagStyle}
        >
          4 Alerts
        </Tag>
      ),
    },
  ];

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 2,
        lg: 4,
        xl: 4,
        xxl: 6,
      }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item>
          <Card
            title={item.title}
            onClick={item.handleClick}
            style={{ textAlign: "center" }}
          >
            {item.content}
          </Card>
        </List.Item>
      )}
    />
  );
};

export default Dashboard;
