import React, { useState, useEffect, useContext } from "react";
import { Form, Button, Select, Tag, Tabs } from "antd";
import { InfoCircleOutlined, AreaChartOutlined } from "@ant-design/icons";
import axios from "axios";
import { FcUndo } from "react-icons/fc";
import { useSnackbar } from "notistack";
import { withStyles } from "@mui/styles";
import { formatNumberWithCommas, getCsvFileIndex } from "../../util/util";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import ApiCallFailed from "../../components/ApiCallFailed";
import { API_FETCH_WAIT } from "../../util/constants";
import RefreshButton from "../../components/RefreshButton";
import ExportButton from "../../components/ExportButton";
import { getCsvHeaders } from "../../util/util";
import TopTablesChart from "./../../chart/TopTablesChart";
import useWindowDimensions from "./../../hooks/useWindowDimensions";
import PageTable from "../../components/PageTable";

const columns = [
  {
    header: "Owner",
    key: "owner",
    width: 300,
    fixed: true,
  },
  {
    header: "Segment Name",
    key: "segmentName",
    width: 300,
  },
  {
    header: "Segment Size (MB)",
    key: "segmentSize",
    width: 135,
    renderCell: (value) => (
      <Tag
        color={value > 1024 ? "gold" : value === 0 ? "default" : "green"}
        key={value}
        style={{ width: "100%", textAlign: "right" }}
      >
        {formatNumberWithCommas(value)}
      </Tag>
    ),
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
const TopTables = ({ classes }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const [chartDisplayLimit, setChartDisplayLimit] = useState(30);
  const ownerList = getDistinctOwners(data);
  const [owner, setOwner] = useState("All");
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();
  const tableHeight = height - 263;

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/space/toptables`)
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
  //* calculate chart height
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
              <InfoCircleOutlined />
              Details
            </span>
          }
          key="details"
        >
          <Form form={form} layout={"inline"} size={"middle"}>
            <Form.Item label="Owner" style={{ width: 300 }}>
              <Select value={owner} onChange={handleOwnerChange}>
                {ownerList.map((owner) => (
                  <Select.Option value={owner} key={owner}>
                    {owner}
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
                    filename: `OMS_TopTables_${getCsvFileIndex()}.csv`,
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
              Chart
            </span>
          }
          key="chart"
        >
          <div style={{ height: chartHeight }}>
            <TopTablesChart
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

export default withStyles(styles)(TopTables);
