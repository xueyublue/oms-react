import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Select, Tag } from "antd";
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
import { getCsvHeaders } from "../../util/util";
import useWindowDimensions from "./../../hooks/useWindowDimensions";
import PageTable from "../../components/PageTable";

const columns = [
  {
    header: "User Name",
    key: "userName",
    width: 220,
    fixed: true,
  },
  {
    header: "Privilege",
    key: "privilege",
    width: 300,
  },
  {
    header: "Admin Option?",
    key: "adminOption",
    width: 120,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (adminOption) => (
      <Tag
        color={adminOption === "No" ? "green" : "volcano"}
        key={adminOption}
        style={{ width: "100%", textAlign: "center" }}
      >
        {adminOption}
      </Tag>
    ),
  },
];

const getDistinctUserNames = (data) => {
  if (!data) return null;
  let userNameList = [];
  data.map((row) => row.userName && userNameList.push(row.userName));
  return ["All", ...new Set(userNameList)];
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
const UserPrivileges = ({ classes }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const userNameList = getDistinctUserNames(data);
  const [userName, setUserName] = useState("All");
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();
  const tableHeight = height - 207;

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/user/userprivileges`)
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

  const handleUsernameChange = (value) => {
    setUserName(value);
    setPageLoad(false);
  };

  const handleClear = () => {
    setUserName("All");
    setPageLoad(false);
  };

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  const filteredData = data.filter((row) => (userName === "All" ? true : row.userName === userName));
  //* display snackbar only one time on page load succeed
  if (!pageLoad) {
    setPageLoad(true);
    enqueueSnackbar(`${filteredData.length} records found.`, { variant: "info" });
  }

  return (
    <div className={classes.root}>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item label="User Name" style={{ width: 300 }}>
          <Select value={userName} onChange={handleUsernameChange}>
            {userNameList.map((userName) => (
              <Select.Option value={userName} key={userName}>
                {userName}
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
                filename: "OMS_UserPrivileges.csv",
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

export default withStyles(styles)(UserPrivileges);
