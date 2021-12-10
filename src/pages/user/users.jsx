import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Select, Tag } from "antd";
import { CheckCircleOutlined, LockOutlined } from "@ant-design/icons";
import axios from "axios";
import { FcUndo } from "react-icons/fc";
import { useSnackbar } from "notistack";
import { withStyles } from "@mui/styles";
import ApiCallFailed from "../../components/ApiCallFailed";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../util/constants";
import RefreshButton from "../../components/RefreshButton";
import ExportButton from "../../components/ExportButton";
import { getCsvFileIndex, getCsvHeaders } from "../../util/util";
import useWindowDimensions from "./../../hooks/useWindowDimensions";
import PageTable from "../../components/PageTable";

const columns = [
  {
    header: "User ID",
    key: "userId",
    width: 100,
    fixed: true,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (text) => (
      <div style={{ color: "#1890FF", width: "100%", textAlign: "center" }}>
        <span>{text}</span>
      </div>
    ),
  },
  {
    header: "User Name",
    key: "userName",
    width: 220,
    fixed: true,
  },
  {
    header: "Account Status",
    key: "accountStatus",
    width: 150,
    fixed: true,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (status) => (
      <Tag
        color={status === "OPEN" ? "green" : "volcano"}
        icon={status === "OPEN" ? <CheckCircleOutlined /> : <LockOutlined />}
        key={status}
        style={{ width: "100%", textAlign: "center" }}
      >
        {status}
      </Tag>
    ),
  },
  {
    header: "Profile",
    key: "profile",
    width: 120,
  },
  {
    header: "Default Tablespace",
    key: "defaultTablespace",
    width: 180,
  },
  {
    header: "Temp Tablespace",
    key: "temporaryTablespace",
    width: 120,
  },
  {
    header: "Created Date",
    key: "createdDate",
    width: 160,
  },
  {
    header: "Expiry Date",
    key: "expiryDate",
    width: 160,
  },
  {
    header: "Lock Date",
    key: "lockDate",
    width: 160,
  },
  {
    header: "Last Login Date",
    key: "lastLogin",
    width: 260,
  },
];

const getDistinctStatus = (data) => {
  if (!data) return null;
  let statusList = [];
  data.map((row) => row.accountStatus && statusList.push(row.accountStatus));
  return ["All", ...new Set(statusList)];
};

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    width: "100%",
  },
  tableTools: {
    position: "absolute",
    right: 0,
  },
  table: {
    marginTop: "10px",
  },
};

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Users = ({ classes }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const statusList = getDistinctStatus(data);
  const [status, setStatus] = useState("All");
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();
  const tableHeight = height - 207;

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/user/users`)
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

  const handleClear = () => {
    setStatus("All");
    setPageLoad(false);
  };

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  const filteredData = data.filter((row) => (status === "All" ? true : row.accountStatus === status));
  //* display snackbar only one time on page load succeed
  if (!pageLoad) {
    setPageLoad(true);
    enqueueSnackbar(`${filteredData.length} records found.`, { variant: "info" });
  }

  return (
    <div className={classes.root}>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item label="Status" style={{ width: 240 }}>
          <Select value={status} onChange={handleStatusChange}>
            {statusList.map((status) => (
              <Select.Option value={status} key={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button onClick={handleClear}>
            <FcUndo size={22} />
          </Button>
        </Form.Item>
        <div className={classes.tableTools}>
          <Form.Item>
            <RefreshButton onClick={handleRefresh} />
            <ExportButton
              csvReport={{
                data: data,
                headers: getCsvHeaders(columns),
                filename: `OMS_Users_${getCsvFileIndex()}.csv`,
              }}
            />
          </Form.Item>
        </div>
      </Form>
      <div className={classes.table}>
        <PageTable height={tableHeight} columns={columns} data={filteredData} />
      </div>
    </div>
  );
};

export default withStyles(styles)(Users);
