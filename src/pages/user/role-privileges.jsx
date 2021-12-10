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
import { getCsvFileIndex, getCsvHeaders } from "../../util/util";
import useWindowDimensions from "./../../hooks/useWindowDimensions";
import PageTable from "../../components/PageTable";

const columns = [
  {
    header: "Role Name",
    key: "roleName",
    width: 300,
    fixed: true,
  },
  {
    header: "Privilege",
    key: "privilege",
    width: 400,
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

const getDistinctRoles = (data) => {
  if (!data) return null;
  let roleList = [];
  data.map((row) => row.role && roleList.push(row.role));
  return ["All", ...new Set(roleList)];
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
const RolePrivileges = ({ classes }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const roleList = getDistinctRoles(data);
  const [role, setRole] = useState("All");
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();
  const tableHeight = height - 207;

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/user/roleprivileges`)
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

  const handleRoleChange = (value) => {
    setRole(value);
    setPageLoad(false);
  };

  const handleClear = () => {
    setRole("All");
    setPageLoad(false);
  };

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  const filteredData = data.filter((row) => (role === "All" ? true : row.role === role));
  //* display snackbar only one time on page load succeed
  if (!pageLoad) {
    setPageLoad(true);
    enqueueSnackbar(`${filteredData.length} records found.`, { variant: "info" });
  }

  return (
    <div className={classes.root}>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item label="Role Name" style={{ width: 350 }}>
          <Select value={role} onChange={handleRoleChange}>
            {roleList.map((role) => (
              <Select.Option value={role} key={role}>
                {role}
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
                filename: `OMS_RolePrivileges_${getCsvFileIndex()}.csv`,
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

export default withStyles(styles)(RolePrivileges);
