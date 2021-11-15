import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Tabs } from "antd";
import { DatabaseOutlined, BuildOutlined, DeploymentUnitOutlined } from "@ant-design/icons";
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
import useWindowDimensions from "../../hooks/useWindowDimensions";

const tableColumns_Database = [
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

const tableColumns_Instance = tableColumns_Database;

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
  const { height } = useWindowDimensions();
  const tableHeight = height - 260;

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
  enqueueSnackbar(`${data.database.length} records found.`, { variant: "info" });

  return (
    <div className={classes.root}>
      <Tabs type="card">
        <TabPane
          tab={
            <span>
              <DatabaseOutlined />
              Database
            </span>
          }
          key="summary"
        >
          <Form form={form} layout={"inline"} size={"middle"}>
            <Form.Item />
            <div className={classes.tableTools}>
              <Form.Item>
                <RefreshButton onClick={handleRefresh} />
                <ExportButton
                  csvReport={{
                    data: data.database,
                    headers: getCsvHeaders(tableColumns_Database),
                    filename: "OMS_Database.csv",
                  }}
                />
              </Form.Item>
            </div>
          </Form>
          <Table
            columns={tableColumns_Database}
            dataSource={data.database}
            bordered
            size="small"
            pagination={{ pageSize: 100, position: ["none"] }}
            scroll={{ x: 700, y: tableHeight }}
            rowKey="name"
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <DeploymentUnitOutlined />
              Instance
            </span>
          }
          key="instance"
        >
          <Form form={form} layout={"inline"} size={"middle"}>
            <Form.Item />
            <div className={classes.tableTools}>
              <Form.Item>
                <RefreshButton onClick={handleRefresh} />
                <ExportButton
                  csvReport={{
                    data: data.instance,
                    headers: getCsvHeaders(tableColumns_Instance),
                    filename: "OMS_Instance.csv",
                  }}
                />
              </Form.Item>
            </div>
          </Form>
          <Table
            columns={tableColumns_Instance}
            dataSource={data.instance}
            bordered
            size="small"
            pagination={{ pageSize: 100, position: ["none"] }}
            scroll={{ x: 700, y: tableHeight }}
            rowKey="name"
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <BuildOutlined />
              Banners
            </span>
          }
          key="banners"
        >
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
