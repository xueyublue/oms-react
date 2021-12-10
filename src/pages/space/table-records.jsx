import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Select, Tag, Tabs, Tooltip } from "antd";
import { TableOutlined, AreaChartOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSnackbar } from "notistack";
import { FcUndo } from "react-icons/fc";
import { withStyles } from "@mui/styles";
import { formatNumberWithCommas, getCsvFileIndex } from "../../util/util";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import ApiCallFailed from "../../components/ApiCallFailed";
import { API_FETCH_WAIT } from "../../util/constants";
import RefreshButton from "../../components/RefreshButton";
import ExportButton from "../../components/ExportButton";
import { getCsvHeaders } from "../../util/util";
import TableRecordsChart from "../../chart/TableRecordsChart";
import useWindowDimensions from "./../../hooks/useWindowDimensions";
import PageTable from "../../components/PageTable";

const columns = [
  {
    header: "Owner",
    key: "owner",
    width: 120,
    fixed: true,
  },
  {
    header: "Table Name",
    key: "tableName",
    width: 250,
  },
  {
    header: "Initial Count",
    key: "initialCount",
    width: 120,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => (
      <Tag color="default" key={value} style={{ width: "100%", textAlign: "right" }}>
        {formatNumberWithCommas(value)}
      </Tag>
    ),
  },
  {
    header: "Current Count",
    key: "currentCount",
    width: 120,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => {
      let style = "default";
      if (value === 0) style = "default";
      else if (value < 10000) style = "green";
      else style = "gold";
      return (
        <Tag color={style} key={value} style={{ width: "100%", textAlign: "right" }}>
          {formatNumberWithCommas(value)}
        </Tag>
      );
    },
  },
  {
    header: "Daily Growth",
    key: "dailyGrowth",
    width: 120,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => {
      let style = "default";
      if (value === 0) style = "default";
      else if (value < 1000) style = "green";
      else style = "gold";
      return (
        <Tag color={style} key={value} style={{ width: "100%", textAlign: "right" }}>
          {formatNumberWithCommas(value)}
        </Tag>
      );
    },
  },
  {
    header: "Monthly Growth",
    key: "monthlyGrowth",
    width: 120,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => {
      let style = "default";
      if (value === 0) style = "default";
      else if (value < 1000 * 30) style = "green";
      else style = "gold";
      return (
        <Tag color={style} key={value} style={{ width: "100%", textAlign: "right" }}>
          {formatNumberWithCommas(value)}
        </Tag>
      );
    },
  },
  {
    header: "Yearly Growth",
    key: "yearlyGrowth",
    width: 120,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => {
      let style = "default";
      if (value === 0) style = "default";
      else if (value < 1000 * 365) style = "green";
      else style = "gold";
      return (
        <Tag color={style} key={value} style={{ width: "100%", textAlign: "right" }}>
          {formatNumberWithCommas(value)}
        </Tag>
      );
    },
  },
  {
    header: "Tablespace Name",
    key: "tablespace",
    width: 250,
  },
];

const getDistinctOwners = (data) => {
  if (!data) return null;
  let owners = [];
  data.map((row) => row.owner && owners.push(row.owner));
  return ["All", ...new Set(owners)];
};

const TabPane = Tabs.TabPane;

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
const TableRecords = ({ classes }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const [chartDisplayLimit, setChartDisplayLimit] = useState(30);
  const [owner, setOwner] = useState("All");
  const ownerList = getDistinctOwners(data);
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();
  const tableHeight = height - 263;

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/space/tablerecords`)
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

  const handleOwnerChange = (value) => {
    setOwner(value);
    setPageLoad(false);
  };

  const handleClear = () => {
    setOwner("All");
    setPageLoad(false);
  };

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  const filteredData = data.filter((row) => (owner === "All" ? true : row.owner === owner));
  //* display snackbar only one time on page load succeed
  if (!pageLoad) {
    setPageLoad(true);
    enqueueSnackbar(`${filteredData.length} records found.`, { variant: "info" });
  }
  //* calculate chart container height
  let chartHeight = 0;
  if (data.length < chartDisplayLimit || chartDisplayLimit === "All")
    chartHeight = data.length * 21 < height ? height - 190 : data.length * 21;
  else chartHeight = chartDisplayLimit * 21 < height ? height - 190 : chartDisplayLimit * 21;
  if (chartHeight <= 600) chartHeight = 600;

  return (
    <div className={classes.root}>
      <Tabs type="card">
        <TabPane
          tab={
            <span>
              <TableOutlined />
              Details
            </span>
          }
          key="details"
        >
          <Form form={form} layout={"inline"} size={"middle"}>
            <Form.Item label="Owner" style={{ width: 200 }}>
              <Select value={owner} onChange={handleOwnerChange}>
                {ownerList.map((owner) => (
                  <Select.Option value={owner} key={owner}>
                    {owner}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Tooltip placement="right" title="CLEAR">
                <Button onClick={handleClear}>
                  <FcUndo size={22} />
                </Button>
              </Tooltip>
            </Form.Item>
            <div className={classes.tableTools}>
              <Form.Item>
                <RefreshButton onClick={handleRefresh} />
                <ExportButton
                  csvReport={{
                    data: data,
                    headers: getCsvHeaders(columns),
                    filename: `OMS_TableRecords_${getCsvFileIndex()}.csv`,
                  }}
                />
              </Form.Item>
            </div>
          </Form>
          <div className={classes.table}>
            <PageTable height={tableHeight} columns={columns} data={filteredData} />
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <AreaChartOutlined />
              Count
            </span>
          }
          key="count"
        >
          <div style={{ height: chartHeight }}>
            <TableRecordsChart
              data={data}
              displayLimit={chartDisplayLimit}
              onDisplayLimitChange={(limit) => setChartDisplayLimit(limit)}
              displayData
            />
          </div>
        </TabPane>
        <TabPane
          tab={
            <span>
              <AreaChartOutlined />
              Growth
            </span>
          }
          key="growth"
        >
          <div style={{ height: chartHeight }}>
            <TableRecordsChart
              data={data}
              displayLimit={chartDisplayLimit}
              onDisplayLimitChange={(limit) => setChartDisplayLimit(limit)}
              displayData
            />
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default withStyles(styles)(TableRecords);
