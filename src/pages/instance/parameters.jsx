import React, { useState, useEffect, useContext } from "react";
import { Tag, Form } from "antd";
import axios from "axios";
import { useSnackbar } from "notistack";
import { withStyles } from "@mui/styles";
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
    header: "Parameter Name",
    key: "name",
    width: 280,
  },
  {
    header: "Value",
    key: "value",
    width: 300,
  },
  {
    header: "Description",
    key: "description",
    width: 500,
  },
  {
    header: "Default?",
    key: "isDefault",
    width: 100,
    render: (value) => (
      <Tag color={value === "True" ? "green" : "geekblue"} key={value}>
        {value}
      </Tag>
    ),
  },
  {
    header: "Session Modificable?",
    key: "isSessionModifiable",
    width: 160,
    render: (value) => (
      <Tag color={value === "True" ? "green" : "geekblue"} key={value}>
        {value}
      </Tag>
    ),
  },
  {
    header: "System Modifucable?",
    key: "isSystemModifiable",
    width: 160,
    render: (value) => (
      <Tag color={value === "True" ? "green" : "geekblue"} key={value}>
        {value}
      </Tag>
    ),
  },
  {
    header: "Instance Modificable?",
    key: "isInstanceModifiable",
    width: 160,
    render: (value) => (
      <Tag color={value === "True" ? "green" : "geekblue"} key={value}>
        {value}
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
const Parameters = ({ classes }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const [form] = Form.useForm();
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();
  const tableHeight = height - 196;

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/instance/parameters`)
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
                filename: "OMS_Parameters.csv",
              }}
            />
          </Form.Item>
        </div>
      </Form>
      <PageTable height={tableHeight} columns={columns} data={data} />
    </div>
  );
};

export default withStyles(styles)(Parameters);
