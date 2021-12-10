import React, { useState, useEffect, useContext } from "react";
import { Progress, Tag, Form, Row, Col, Tabs } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined, TableOutlined, AreaChartOutlined } from "@ant-design/icons";
import axios from "axios";
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
import TablespaceSizeChart from "../../chart/TablespaceSizeChart";
import TablespaceOccupancyChart from "../../chart/TablespaceOccupancyChart";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import PageTable from "../../components/PageTable";

const columns = [
  {
    header: "Name",
    key: "name",
    width: 250,
    fixed: true,
  },
  {
    header: "Path",
    key: "path",
    width: 400,
  },
  {
    header: "Status",
    key: "status",
    width: 110,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (status) => (
      <Tag
        color={status === "Online" ? "green" : "volcano"}
        icon={status === "Online" ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
        key={status}
        style={{ width: "100%", height: "100%", textAlign: "center" }}
      >
        {status}
      </Tag>
    ),
  },
  {
    header: "Total Size (MB)",
    key: "size",
    width: 110,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => (
      <Tag color={value >= 10240 ? "gold" : "green"} key={value} style={{ width: "100%", textAlign: "right" }}>
        {formatNumberWithCommas(value)}
      </Tag>
    ),
  },
  {
    header: "Free Size (MB) ",
    key: "freeSize",
    width: 120,
    renderCell: (value) => <div style={{ textAlign: "right", width: "100%" }}>{formatNumberWithCommas(value)}</div>,
  },
  {
    header: "Occupancy",
    key: "occupancy",
    width: 200,
    renderCell: (text) => (
      <Progress
        percent={text}
        status={text >= 80 ? "exception" : "normal"}
        strokeLinecap="square"
        format={(percent) => `${percent}%`}
      />
    ),
  },
  {
    header: "Auto Extend?",
    key: "autoExtensible",
    width: 100,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (autoExtensible) => (
      <Tag
        color={autoExtensible === "Yes" ? "green" : "volcano"}
        key={autoExtensible}
        style={{ width: "100%", height: "100%", textAlign: "center" }}
      >
        {autoExtensible}
      </Tag>
    ),
  },
  {
    header: "Next Extend (MB)",
    key: "nextExtend",
    width: 130,
    renderCell: (value) => <div style={{ textAlign: "right", width: "100%" }}>{formatNumberWithCommas(value)}</div>,
  },
  {
    header: "Contents",
    key: "contents",
    width: 100,
  },
  {
    header: "Allocation Type",
    key: "allocationType",
    width: 120,
  },
];

const countHighOccupancy = (data) => {
  let count = 0;
  data.map((item) => {
    if (item.occupancy >= 80) count++;
    return null;
  });
  return count;
};

const TabPane = Tabs.TabPane;

//-------------------------------------------------------------
// STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    width: "100%",
  },
  tag: {
    fontSize: "1rem",
    padding: "5px",
  },
  tableTools: {
    position: "absolute",
    right: 0,
  },
};

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Tablespace = ({ classes }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const [form] = Form.useForm();
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/space/tablespace`)
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
    const count = countHighOccupancy(data.table);
    setPageLoad(true);
    if (count && count > 0)
      enqueueSnackbar(`There are ${count} tablespace occupancy more than 80%.`, {
        variant: "warning",
      });
    else enqueueSnackbar(`${data.table.length} records found.`, { variant: "info" });
  }
  let chartHeight = (height - 200) / 2;
  if (chartHeight <= 340) chartHeight = 340;
  const tableHeight = height - 252;

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
          <Form form={form} layout={"inline"}>
            <Form.Item />
            <div className={classes.tableTools}>
              <Form.Item>
                <RefreshButton onClick={handleRefresh} />
                <ExportButton
                  csvReport={{
                    data: data.table,
                    headers: getCsvHeaders(columns),
                    filename: `OMS_Tablespace_${getCsvFileIndex()}.csv`,
                  }}
                />
              </Form.Item>
            </div>
          </Form>
          <div className={classes.table}>
            <PageTable height={tableHeight} columns={columns} data={data.table} />
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
          <Row>
            <Col lg={24} xl={24} xxl={24}>
              <div style={{ height: chartHeight }}>
                <TablespaceOccupancyChart
                  labels={data.occupancyChart.name}
                  data={data.occupancyChart.data}
                  displayData
                />
              </div>
            </Col>
            <Col lg={24} xl={24} xxl={24}>
              <div style={{ height: chartHeight }}>
                <TablespaceSizeChart labels={data.totalSizeChart.name} data={data.totalSizeChart.data} displayData />
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default withStyles(styles)(Tablespace);
