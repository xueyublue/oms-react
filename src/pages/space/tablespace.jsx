import React, { useState, useEffect, useContext } from "react";
import { Table, Progress, Tag, Form, Row, Col } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSnackbar } from "notistack";
import { withStyles } from "@mui/styles";
import { formatNumberWithCommas } from "../../util/util";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import ApiCallFailed from "../../components/ApiCallFailed";
import { API_FETCH_WAIT } from "../../util/constants";
import RefreshButton from "../../components/RefreshButton";
import ExportButton from "../../components/ExportButton";
import { getCsvHeaders } from "../../util/util";
import TablespaceSizeChart from "../../chart/TablespaceSizeChart";
import TablespaceOccupancyChart from "../../chart/TablespaceOccupancyChart";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 200,
    sorter: (a, b) => a.name > b.name,
    fixed: "left",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 100,
    align: "center",
    render: (status) => (
      <Tag
        color={status === "Online" ? "green" : "volcano"}
        icon={status === "Online" ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
        key={status}
      >
        {status}
      </Tag>
    ),
  },
  {
    title: "Path",
    dataIndex: "path",
    key: "path",
    width: 400,
    sorter: (a, b) => a.path > b.path,
  },
  {
    title: "Size (MB)",
    dataIndex: "size",
    key: "size",
    width: 100,
    align: "right",
    render: (value) => formatNumberWithCommas(value),
    sorter: (a, b) => a.size - b.size,
  },
  {
    title: "Free Size (MB) ",
    dataIndex: "freeSize",
    key: "freeSize",
    width: 120,
    align: "right",
    render: (value) => formatNumberWithCommas(value),
    sorter: (a, b) => a.freeSize - b.freeSize,
  },
  {
    title: "Occupancy",
    dataIndex: "occupancy",
    key: "occupancy",
    width: 140,
    align: "center",
    render: (text) => (
      <Progress
        percent={text}
        status={text >= 80 ? "exception" : "normal"}
        strokeLinecap="square"
        format={(percent) => `${percent}%`}
      />
    ),
    sorter: (a, b) => a.occupancy - b.occupancy,
  },
  {
    title: "Auto Extend?",
    dataIndex: "autoExtensible",
    key: "autoExtensible",
    width: 110,
    align: "center",
    render: (autoExtensible) => (
      <Tag color={autoExtensible === "Yes" ? "green" : "volcano"} key={autoExtensible}>
        {autoExtensible}
      </Tag>
    ),
  },
  {
    title: "Next Extend (MB)",
    dataIndex: "nextExtend",
    key: "nextExtend",
    width: 130,
    align: "right",
    render: (value) => formatNumberWithCommas(value),
  },
  {
    title: "Contents",
    dataIndex: "contents",
    key: "contents",
    width: 100,
  },
  {
    title: "Allocation Type",
    dataIndex: "allocationType",
    key: "allocationType",
    width: 120,
  },
];

const countHighOccupancy = (data) => {
  let count = 0;
  data.map((item) => {
    if (item.occupancy >= 80) count++;
  });
  return count;
};

//-------------------------------------------------------------
// STYLES START
//-------------------------------------------------------------
const styles = {
  root: {},
  chartContainer: {
    height: "370px",
    width: "100%",
  },
  tag: {
    fontSize: "1rem",
    padding: "4px",
  },
};

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Tablespace = ({ classes }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const [form] = Form.useForm();
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/space/tablespace`)
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
    fetchData();
  }, [baseUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  enqueueSnackbar(`${data.table.length} records found.`, { variant: "info" });
  const count = countHighOccupancy(data.table);

  return (
    <div>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item>
          <Tag
            className={classes.tag}
            icon={count === 0 ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
            color={count === 0 ? "green" : "volcano"}
          >
            {count === 0
              ? `All tablespace occupancy are normal. No action required.`
              : `There are ${count} tablespace occupancy more than 80%. Manual extension might required.`}
          </Tag>
        </Form.Item>
        <div style={{ position: "absolute", right: 0 }}>
          <Form.Item>
            <RefreshButton
              onClick={() => {
                setIsLoading(true);
                fetchData();
              }}
            />
            <ExportButton
              csvReport={{
                data: data.table,
                headers: getCsvHeaders(columns),
                filename: "OMS_Tablespace.csv",
              }}
            />
          </Form.Item>
        </div>
      </Form>
      <Table
        columns={columns}
        dataSource={data.table}
        bordered
        size="small"
        pagination={{ pageSize: 15, position: ["none"] }}
        scroll={{ x: 1500 }}
        rowKey="name"
      />
      <Row>
        <Col lg={24} xl={24} xxl={12}>
          <div className={classes.chartContainer}>
            <TablespaceOccupancyChart labels={data.occupancyChart.name} data={data.occupancyChart.data} />
          </div>
        </Col>
        <Col lg={24} xl={24} xxl={12}>
          <div className={classes.chartContainer}>
            <TablespaceSizeChart labels={data.totalSizeChart.name} data={data.totalSizeChart.data} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withStyles(styles)(Tablespace);
