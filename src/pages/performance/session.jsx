import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Button, Select, Tag, Tabs } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined, TableOutlined, DashboardOutlined } from "@ant-design/icons";
import axios from "axios";
import { FcUndo } from "react-icons/fc";
import { withStyles } from "@mui/styles";
import Loading from "../../components/Loading";
import ApiCallFailed from "../../components/ApiCallFailed";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../util/constants";
import RefreshButton from "../../components/RefreshButton";
import ExportButton from "../../components/ExportButton";
import { getCsvHeaders } from "../../util/util";
import { useSnackbar } from "notistack";
import SessionChart from "../../chart/SessionChart";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const columns = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
    width: 50,
    align: "center",
    render: (text) => <span style={{ color: "#1890FF" }}>{text}</span>,
    sorter: (a, b) => a.id - b.id,
    fixed: "left",
  },
  {
    title: "Serial #",
    dataIndex: "serialNo",
    key: "serialNo",
    width: 80,
    sorter: (a, b) => a.serialNo - b.serialNo,
    fixed: "left",
    align: "center",
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 100,
    render: (status) => (
      <Tag
        color={status === "Active" ? "warning" : "success"}
        icon={status === "Active" ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
        key={status}
      >
        {status}
      </Tag>
    ),
    fixed: "left",
    align: "center",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 100,
  },
  {
    title: "User Name",
    dataIndex: "userName",
    key: "userName",
    width: 100,
  },
  {
    title: "OS User",
    dataIndex: "osUser",
    key: "osUser",
    width: 110,
  },
  {
    title: "Machine",
    dataIndex: "machine",
    key: "machine",
    width: 150,
  },
  {
    title: "Terminal",
    dataIndex: "terminal",
    key: "terminal",
    width: 150,
  },
  {
    title: "Program",
    dataIndex: "program",
    key: "program",
    width: 180,
  },
  {
    title: "Module",
    dataIndex: "module",
    key: "module",
    width: 150,
  },
  {
    title: "Process",
    dataIndex: "process",
    key: "process",
    width: 100,
    sorter: (a, b) => a.process - b.process,
  },
  {
    title: "Logon Time",
    dataIndex: "logonTime",
    key: "logonTime",
    width: 180,
  },
];

const getDistinctStatus = () => {
  return ["All", "Active", "Inactive"];
};

const getDistinctUserNames = (data) => {
  if (!data) return null;
  let usernames = [];
  data.map((row) => row.userName && usernames.push(row.userName));
  return ["All", ...new Set(usernames)];
};

const TabPane = Tabs.TabPane;

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    width: "100%",
  },
  form: {
    display: "flex",
    alignItems: "center",
  },
  table: {
    marginTop: "10px",
  },
};

//-------------------------------------------------------------
//* PAGE START
//-------------------------------------------------------------
const Sessions = ({ classes }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const statusList = getDistinctStatus();
  const userNameList = getDistinctUserNames(data);
  const [status, setStatus] = useState("All");
  const [userName, setUserName] = useState("All");
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/sessions`)
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

  const handleRefresh = () => {
    setIsLoading(true);
    fetchData();
    setPageLoad(false);
  };

  const handleStatusChange = (value) => {
    setStatus(value);
    setPageLoad(false);
  };

  const handleUsernameChange = (value) => {
    setUserName(value);
    setPageLoad(false);
  };

  const handleClear = () => {
    setStatus("All");
    setUserName("All");
    setPageLoad(false);
  };

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  const filteredData = data
    .filter((row) => (userName === "All" ? true : row.userName === userName))
    .filter((row) => (status === "All" ? true : row.status === status));
  //* display snackbar only one time on page load succeed
  if (!pageLoad) {
    setPageLoad(true);
    enqueueSnackbar(`${filteredData.length} records found.`, { variant: "info" });
  }

  return (
    <div className={classes.root}>
      <Tabs type="card">
        <TabPane
          tab={
            <span>
              <TableOutlined />
              Table
            </span>
          }
          key="table"
        >
          <Form form={form} layout={"inline"} size={"middle"} className={classes.form}>
            <Form.Item label="Status">
              <Select value={status} onChange={handleStatusChange} style={{ width: 100 }}>
                {statusList.map((status) => (
                  <Select.Option value={status} key={status}>
                    {status}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item label="User Name" style={{ width: 200 }}>
              <Select value={userName} onChange={handleUsernameChange}>
                {userNameList.map((username) => (
                  <Select.Option value={username} key={username}>
                    {username}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button onClick={handleClear}>
                <FcUndo size={22} />
              </Button>
            </Form.Item>
            <Form.Item style={{ marginLeft: "auto", marginRight: 0 }}>
              <RefreshButton onClick={handleRefresh} />
              <ExportButton
                csvReport={{
                  data: data,
                  headers: getCsvHeaders(columns),
                  filename: "OMS_Sessions.csv",
                }}
              />
            </Form.Item>
          </Form>
          <Table
            className={classes.table}
            columns={columns}
            dataSource={filteredData}
            bordered
            size="small"
            pagination={{
              page: page,
              pageSize: pageSize,
              position: ["bottomRight"],
              pageSizeOptions: [30, 50, 100, 500],
              onChange: (p, size) => {
                setPage(p);
                setPageSize(size);
              },
            }}
            scroll={{ x: 1600, y: height - 325 }}
            rowKey="id"
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <DashboardOutlined />
              Monitoring
            </span>
          }
          key="monitoring"
        >
          <div style={{ height: height - 200 }}>
            <SessionChart withinComponent />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default withStyles(styles)(Sessions);
