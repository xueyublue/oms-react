import React, { useState, useEffect, useContext } from "react";
import { Form, Tabs } from "antd";
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
import PageTable from "../../components/PageTable";

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
const tableColumns_Database = [
  {
    header: "Field",
    key: "name",
    width: 400,
  },
  {
    header: "Value",
    key: "value",
    width: 400,
  },
];
const tableColumns_Instance = tableColumns_Database;
const tableColumns_Banners = [
  {
    header: "Banner",
    key: "banner",
    width: "100%",
  },
];
const TabPane = Tabs.TabPane;

const InstanceDetails = ({ classes }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const [form] = Form.useForm();
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();
  const tableHeight = height - 252;

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
  //* display snackbar only one time on page load succeed
  if (!pageLoad) {
    setPageLoad(true);
    enqueueSnackbar(`${data.database.length} records found.`, { variant: "info" });
  }

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
          <PageTable height={tableHeight} columns={tableColumns_Database} data={data.database} />
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
          <PageTable height={tableHeight} columns={tableColumns_Instance} data={data.instance} />
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
          <PageTable height={tableHeight} columns={tableColumns_Banners} data={data.banners} />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default withStyles(styles)(InstanceDetails);
