import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Tabs } from "antd";
import { TableOutlined } from "@ant-design/icons";
import axios from "axios";
import { useSnackbar } from "notistack";
import { withStyles } from "@mui/styles";
import Loading from "../../components/Loading";
import ApiCallFailed from "../../components/ApiCallFailed";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../util/constants";
import RefreshButton from "../../components/RefreshButton";
import ExportButton from "../../components/ExportButton";
import { getCsvHeaders } from "../../util/util";

const tableColumns_Summary = [
  {
    title: "Field",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];

const tableColumns_Banners = [
  {
    title: "Banner",
    dataIndex: "banner",
    key: "banner",
  },
];

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
};

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const InstanceDetails = ({ classes }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const [form] = Form.useForm();
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/instance/details`)
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
  };

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  enqueueSnackbar(`${data.summary.length} records found.`, { variant: "info" });

  return (
    <div className={classes.root}>
      <Tabs type="card">
        <TabPane tab={<span>Summary</span>} key="summary">
          <Form form={form} layout={"inline"} size={"middle"}>
            <Form.Item />
            <div className={classes.tableTools}>
              <Form.Item>
                <RefreshButton onClick={handleRefresh} />
                <ExportButton
                  csvReport={{
                    data: data.summary,
                    headers: getCsvHeaders(tableColumns_Summary),
                    filename: "OMS_InstanceDetails.csv",
                  }}
                />
              </Form.Item>
            </div>
          </Form>
          <Table
            columns={tableColumns_Summary}
            dataSource={data.summary}
            bordered
            size="small"
            pagination={{ pageSize: 15, position: ["none"] }}
            scroll={{ x: 700 }}
            rowKey="name"
          />
        </TabPane>
        <TabPane tab={<span>Banners</span>} key="banners">
          <Form form={form} layout={"inline"} size={"middle"}>
            <Form.Item />
            <div className={classes.tableTools}>
              <Form.Item>
                <RefreshButton onClick={handleRefresh} />
                <ExportButton
                  csvReport={{
                    data: data.banners,
                    headers: getCsvHeaders(tableColumns_Banners),
                    filename: "OMS_Banners.csv",
                  }}
                />
              </Form.Item>
            </div>
          </Form>
          <Table
            columns={tableColumns_Banners}
            dataSource={data.banners}
            bordered
            size="small"
            pagination={{ pageSize: 15, position: ["none"] }}
            scroll={{ x: 600 }}
            rowKey="banner"
          />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default withStyles(styles)(InstanceDetails);
