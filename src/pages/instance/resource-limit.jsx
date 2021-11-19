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

const decideTagColor = (value) => {
  console.log(value);
  if (value === "Unlimited") return "gold";
  if (value != 0 && value != "0") return "green";
  return "default";
};

const columns = [
  {
    header: "Resource Name",
    key: "resourceName",
    width: 300,
  },
  {
    header: "Current Utilization",
    key: "currentUtilization",
    width: 130,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => (
      <Tag color={decideTagColor(value)} key={value} style={{ width: "100%", textAlign: "center" }}>
        {value}
      </Tag>
    ),
  },
  {
    header: "Max Utilization",
    key: "maxUtilization",
    width: 130,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => (
      <Tag color={decideTagColor(value)} key={value} style={{ width: "100%", textAlign: "center" }}>
        {value}
      </Tag>
    ),
  },
  {
    header: "Initial Allocation",
    key: "initialAllocation",
    width: 130,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => (
      <Tag color={decideTagColor(value)} key={value} style={{ width: "100%", textAlign: "center" }}>
        {value}
      </Tag>
    ),
  },
  {
    header: "Limit Value",
    key: "limitValue",
    width: 130,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => (
      <Tag color={value === "Unlimited" ? "gold" : "green"} key={value} style={{ width: "100%", textAlign: "center" }}>
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
const ResourceLimit = ({ classes }) => {
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
        .get(`${baseUrl}/instance/resourcelimit`)
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
                filename: "OMS_ResourceLimit.csv",
              }}
            />
          </Form.Item>
        </div>
      </Form>
      <PageTable height={tableHeight} columns={columns} data={data} />
    </div>
  );
};

export default withStyles(styles)(ResourceLimit);
