import React, { useState, useEffect, useContext } from "react";
import { Table, Tag, Form } from "antd";
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

const columns = [
  {
    title: "Resource Name",
    dataIndex: "resourceName",
    key: "resourceName",
    width: 300,
    sorter: (a, b) => a.resourceName > b.resourceName,
  },
  {
    title: "Current Utilization",
    dataIndex: "currentUtilization",
    key: "currentUtilization",
    width: 150,
    sorter: (a, b) => a.currentUtilization - b.currentUtilization,
  },
  {
    title: "Max Utilization",
    dataIndex: "maxUtilization",
    key: "maxUtilization",
    width: 150,
    sorter: (a, b) => a.maxUtilization - b.maxUtilization,
  },
  {
    title: "Initial Allocation",
    dataIndex: "initialAllocation",
    key: "initialAllocation",
    width: 150,
    sorter: (a, b) => a.initialAllocation - b.initialAllocation,
  },
  {
    title: "Limit Value",
    dataIndex: "limitValue",
    key: "limitValue",
    render: (limitValue) => (
      <Tag color={limitValue === "Unlimited" ? "green" : "geekblue"} key={limitValue}>
        {limitValue}
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const [form] = Form.useForm();
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();

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
      <Table
        columns={columns}
        dataSource={data}
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
        scroll={{ x: 1000, y: height - 260 }}
        rowKey="resourceName"
      />
    </div>
  );
};

export default withStyles(styles)(ResourceLimit);
