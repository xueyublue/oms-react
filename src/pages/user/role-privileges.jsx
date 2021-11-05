import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Button, Select, Tag } from "antd";
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

const columns = [
  {
    title: "Role Name",
    dataIndex: "role",
    key: "role",
    width: 300,
  },
  {
    title: "Privilege",
    dataIndex: "privilege",
    key: "privilege",
    width: 400,
  },
  {
    title: "Admin Option",
    dataIndex: "adminOption",
    key: "adminOption",
    render: (adminOption) => (
      <Tag color={adminOption === "No" ? "green" : "volcano"} key={adminOption}>
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const roleList = getDistinctRoles(data);
  const [role, setRole] = useState("All");
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();

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
                filename: "OMS_RolePrivileges.csv",
              }}
            />
          </Form.Item>
        </div>
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
        scroll={{ x: 900, y: height - 270 }}
        rowKey={(item) => `${item.role}${item.privilege}`}
      />
    </div>
  );
};

export default withStyles(styles)(RolePrivileges);
