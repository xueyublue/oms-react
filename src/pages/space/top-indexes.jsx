import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Button, Select, Tag, Tabs } from "antd";
import { TableOutlined, AimOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSnackbar } from "notistack";
import { FcUndo } from "react-icons/fc";
import { withStyles } from "@mui/styles";
import { formatNumberWithCommas } from "../../util/util";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import ApiCallFailed from "../../components/ApiCallFailed";
import { API_FETCH_WAIT } from "../../util/constants";
import RefreshButton from "../../components/RefreshButton";
import ExportButton from "../../components/ExportButton";
import { getCsvHeaders } from "../../util/util";
import TopIndexesChart from "./../../chart/TopIndexesChart";
import useWindowDimensions from "./../../hooks/useWindowDimensions";

const columns = [
  {
    title: "Owner",
    dataIndex: "owner",
    key: "owner",
    width: 300,
  },
  {
    title: "Segment Name",
    dataIndex: "segmentName",
    key: "segmentName",
    width: 300,
  },
  {
    title: "Segment Size (MB)",
    dataIndex: "segmentSize",
    key: "segmentSize",
    align: "right",
    sorter: (a, b) => a.segmentSize - b.segmentSize,
    render: (value) => (
      <Tag color={value > 1024 ? "gold" : value === 0 ? "default" : "green"} key={value}>
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
const TopIndexes = ({ classes }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
  const [chartDisplayLimit, setChartDisplayLimit] = useState(30);
  const ownerList = getDistinctOwners(data);
  const [owner, setOwner] = useState("All");
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/space/topindexes`)
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
              Table
            </span>
          }
          key="table"
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
                    filename: "OMS_TopIndexes.csv",
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
            scroll={{ x: 800, y: height - 325 }}
            rowKey="segmentName"
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <AimOutlined />
              {`Top ${chartDisplayLimit} Indexes`}
            </span>
          }
          key="chart"
        >
          <div style={{ height: chartHeight }}>
            <TopIndexesChart
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

export default withStyles(styles)(TopIndexes);
