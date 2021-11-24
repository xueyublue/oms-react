import React, { useState, useEffect, useContext } from "react";
import { Tag, Form } from "antd";
import axios from "axios";
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
    header: "Role ID",
    key: "roleId",
    width: 80,
    fixed: true,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (text) => (
      <div style={{ color: "#1890FF", width: "100%", textAlign: "center" }}>
        <span>{text}</span>
      </div>
    ),
  },
  {
    header: "Role",
    key: "role",
    width: 300,
  },
  {
    header: "Password Required?",
    key: "passwordRequired",
    width: 150,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (passwordRequired) => (
      <Tag
        color={passwordRequired === "No" ? "green" : "geekblue"}
        key={passwordRequired}
        style={{ width: "100%", textAlign: "center" }}
      >
        {passwordRequired}
      </Tag>
    ),
  },
];

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
};

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Roles = ({ classes }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const [form] = Form.useForm();
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();
  const tableHeight = height - 207;

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/user/roles`)
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

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  //* display snackbar only one time on page load succeed
  if (!pageLoad) {
    setPageLoad(true);
    enqueueSnackbar(`${data.length} records found.`, { variant: "info" });
  }

  return (
    <div className={classes.root}>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item />
        <div className={classes.tableTools}>
          <Form.Item>
            <RefreshButton onClick={handleRefresh} />
            <ExportButton
              csvReport={{
                data: data,
                headers: getCsvHeaders(columns),
                filename: `OMS_Roles_${getCsvFileIndex()}.csv`,
              }}
            />
          </Form.Item>
        </div>
      </Form>
      <div className={classes.table}>
        <PageTable height={tableHeight} columns={columns} data={data} />
      </div>
    </div>
  );
};

export default withStyles(styles)(Roles);
