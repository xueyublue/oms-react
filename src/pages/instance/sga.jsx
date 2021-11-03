import React, { useState, useEffect, useContext } from "react";
import { Table, Progress, Form, Row, Col, Tag } from "antd";
import axios from "axios";
import { useSnackbar } from "notistack";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { formatNumberWithCommas } from "../../util/util";
import Loading from "../../components/Loading";
import ApiCallFailed from "../../components/ApiCallFailed";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../util/constants";
import RefreshButton from "../../components/RefreshButton";
import ExportButton from "../../components/ExportButton";
import { getCsvHeaders } from "../../util/util";
import SgaDoughnutChart from "../../chart/SgaDoughnutChart";
import SgaBarChart from "./../../chart/SgaBarChart";
import { withStyles } from "@mui/styles";
import useWindowDimensions from "./../../hooks/useWindowDimensions";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 250,
  },
  {
    title: "Size",
    dataIndex: "size",
    key: "size",
    width: 180,
    align: "right",
    render: (value) => formatNumberWithCommas(value),
    sorter: (a, b) => a.size - b.size,
  },
  {
    title: "Percentage%",
    dataIndex: "percentage",
    key: "percentage",
    render: (percentage) => (
      <div>
        <Progress
          percent={percentage}
          status={percentage >= 80 ? "exception" : "normal"}
          strokeLinecap="square"
          format={(percentage) => `${percentage}`}
        />
      </div>
    ),
    sorter: (a, b) => a.percentage - b.percentage,
  },
];
//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {},
  chartContainer: {
    width: "100%",
  },
  tag: {
    fontSize: "1rem",
    padding: "5px",
  },
};

//-------------------------------------------------------------
//* PAGE START
//-------------------------------------------------------------
const SgaConfigurations = ({ classes }) => {
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
        .get(`${baseUrl}/instance/sgaconfig`)
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
  //* display snackbar only one time on page load succeed
  if (!pageLoad) {
    setPageLoad(true);
    enqueueSnackbar(`${data.table.length} records found.`, { variant: "info" });
  }
  let chartContainerHeight = height - 600;
  if (chartContainerHeight <= 250) chartContainerHeight = 250;

  return (
    <div>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item>
          <Tag className={classes.tag} icon={<ExclamationCircleOutlined />} color={"geekblue"}>
            System Global Area (SGA): {data.maxSgaSize} MB in total.
          </Tag>
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
                data: data.table,
                headers: getCsvHeaders(columns),
                filename: "OMS_SGA.csv",
              }}
            />
          </Form.Item>
        </div>
      </Form>
      <Row>
        <Col lg={24} xl={24}>
          <Table
            columns={columns}
            dataSource={data.table}
            bordered
            size="small"
            pagination={{ pageSize: 15, position: ["none"] }}
            rowKey="name"
          />
        </Col>
      </Row>
      <Row>
        <Col lg={24} xl={12} xxl={12}>
          <div className={classes.chartContainer} style={{ height: chartContainerHeight }}>
            <SgaBarChart data={data} />
          </div>
        </Col>
        <Col lg={24} xl={12} xxl={12}>
          <div className={classes.chartContainer} style={{ height: chartContainerHeight }}>
            <SgaDoughnutChart data={data} />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withStyles(styles)(SgaConfigurations);
