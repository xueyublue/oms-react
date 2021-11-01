import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Button, Select, Tag, Tabs, Row, Col, Tooltip } from "antd";
import { TableOutlined, AimOutlined } from "@ant-design/icons";
import axios from "axios";
import { FcUndo } from "react-icons/fc";
import { useSnackbar } from "notistack";
import { withStyles } from "@mui/styles";
import { formatNumberWithCommas } from "../../util/util";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import ApiCallFailed from "../../components/ApiCallFailed";
import { API_FETCH_WAIT } from "../../util/constants";
import RefreshButton from "../../components/RefreshButton";
import ExportButton from "../../components/ExportButton";
import { getCsvHeaders } from "../../util/util";
import TopTablesChart from "./../../chart/TopTablesChart";

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
  root: {},
  chartContainer: {
    height: "2000px",
    width: "100%",
  },
};

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const TopTables = ({ classes }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const ownerList = getDistinctOwners(data);
  const [owner, setOwner] = useState("All");
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();

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

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  const filteredData = data.filter((row) => (owner === "All" ? true : row.owner === owner));
  enqueueSnackbar(`${filteredData.length} records found.`, { variant: "info" });

  return (
    <div>
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
              <Select
                value={owner}
                onChange={(value) => {
                  setOwner(value);
                }}
              >
                {ownerList.map((owner) => (
                  <Select.Option value={owner} key={owner}>
                    {owner}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() => {
                  setOwner("All");
                }}
              >
                <FcUndo size={22} />
              </Button>
            </Form.Item>
            <div style={{ position: "absolute", right: 0 }}>
              <Form.Item>
                <RefreshButton
                  onClick={() => {
                    setIsLoading(true);
                    fetchData();
                  }}
                />
                <ExportButton
                  csvReport={{
                    data: data,
                    headers: getCsvHeaders(columns),
                    filename: "OMS_TopTables.csv",
                  }}
                />
              </Form.Item>
            </div>
          </Form>
          <Table
            style={{ marginTop: 10 }}
            columns={columns}
            dataSource={filteredData}
            bordered
            size="small"
            pagination={{
              page: page,
              pageSize: pageSize,
              position: ["bottomRight"],
              pageSizeOptions: [10, 15, 30, 100, 500],
              onChange: (p, size) => {
                setPage(p);
                setPageSize(size);
              },
            }}
            scroll={{ x: 800 /*, y: 620 */ }}
            rowKey="segmentName"
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <AimOutlined />
              Top 100 Tables
            </span>
          }
          key="chart"
        >
          <Row>
            <Col lg={24} xl={24} xxl={24}>
              <div className={classes.chartContainer}>
                <TopTablesChart data={data} limit={100} />
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default withStyles(styles)(TopTables);
