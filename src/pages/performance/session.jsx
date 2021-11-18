import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Select, Tag, Tabs } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  TableOutlined,
  DashboardOutlined,
  UserOutlined,
  SyncOutlined,
} from "@ant-design/icons";
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
import SessionDetailModal from "../../components/SessionDetailModal";
import PageTable from "../../components/PageTable";

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
  const [sessionId, setSessionId] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const statusList = getDistinctStatus();
  const userNameList = getDistinctUserNames(data);
  const [status, setStatus] = useState("All");
  const [userName, setUserName] = useState("All");
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();
  const tableHeight = height - 263;

  const columns = [
    {
      header: "ID",
      key: "id",
      width: 80,
      renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
      renderCell: (text) => (
        <div style={{ color: "#1890FF", width: "100%", textAlign: "center" }}>
          <a
            href="#"
            onClick={() => {
              setSessionId(text);
              setShowDetail(true);
            }}
          >
            {text}
          </a>
        </div>
      ),
    },
    {
      header: "Serial #",
      key: "serialNo",
      width: 80,
    },
    {
      header: "Status",
      key: "status",
      width: 120,
      renderCell: (status) => (
        <Tag
          color={status === "Active" ? "gold" : "success"}
          icon={status === "Active" ? <ExclamationCircleOutlined /> : <CheckCircleOutlined />}
          key={status}
          style={{ width: "100%", textAlign: "center" }}
        >
          {status}
        </Tag>
      ),
    },
    {
      header: "Type",
      key: "type",
      width: 120,
      renderCell: (type) => (
        <Tag
          color={type === "User" ? "gold" : "success"}
          icon={type === "User" ? <UserOutlined /> : <SyncOutlined />}
          key={type}
          style={{ width: "100%", textAlign: "center" }}
        >
          {type}
        </Tag>
      ),
    },
    {
      header: "User Name",
      key: "userName",
      width: 100,
    },
    {
      header: "OS User",
      key: "osUser",
      width: 150,
    },
    {
      header: "Machine",
      key: "machine",
      width: 150,
    },
    {
      header: "Terminal",
      key: "terminal",
      width: 150,
    },
    {
      header: "Program",
      key: "program",
      width: 180,
    },
    {
      header: "Module",
      key: "module",
      width: 180,
    },
    {
      header: "Process",
      key: "process",
      width: 100,
    },
    {
      header: "Logon Time",
      key: "logonTime",
      width: 180,
    },
  ];

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
          {showDetail && (
            <SessionDetailModal sessionId={sessionId} show={showDetail} onCancel={() => setShowDetail(false)} />
          )}
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
          <div className={classes.table}>
            <PageTable height={tableHeight} columns={columns} data={filteredData} />
          </div>
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
