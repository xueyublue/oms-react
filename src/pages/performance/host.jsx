import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@mui/styles";
import { Row, Col, Tabs, Form, Switch } from "antd";
import { ApartmentOutlined, HddOutlined } from "@ant-design/icons";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import axios from "axios";
import { useSnackbar } from "notistack";
import Loading from "../../components/Loading";
import ApiCallFailed from "./../../components/ApiCallFailed";
import { API_FETCH_WAIT } from "../../util/constants";
import { BackendAPIContext } from "./../../context/BackendAPIContext";
import HostCpuAndRamChart from "./../../chart/HostCpuAndRamChart";
import useWindowDimensions from "../../hooks/useWindowDimensions";

const TabPane = Tabs.TabPane;

//-------------------------------------------------------------
// STYLES START
//-------------------------------------------------------------
const styles = {
  root: {},
  chartContainer: {
    width: "100%",
  },
};

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
function Host({ classes }) {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [displayDataLabel, setDisplayDataLabel] = useState(true);
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();
  const { height } = useWindowDimensions();

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/dashboard`)
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
    const interval = setInterval(() => {
      fetchData();
    }, API_FETCH_WAIT * 5);
    return () => clearInterval(interval);
  }, [baseUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  //* display snackbar only one time to inform the refresh interval
  if (!pageLoad) {
    setPageLoad(true);
    enqueueSnackbar("Host Resource loaded, refresh interval: 5 seconds.", {
      variant: "success",
      autoHideDuration: 5000,
    });
  }
  const chartContainerHeight = height - 250;

  return (
    <div className={classes.root}>
      <Tabs type="card">
        <TabPane
          tab={
            <span>
              <ApartmentOutlined />
              CPU/RAM
            </span>
          }
          key="table"
        >
          <Row>
            <Col lg={24} xl={24} xxl={24}>
              <Form.Item label="Display Data Labels" style={{ width: 200 }}>
                <Switch
                  defaultChecked
                  checkedChildren={<MdVisibility />}
                  unCheckedChildren={<MdVisibilityOff />}
                  onChange={(value) => {
                    setDisplayDataLabel(value);
                  }}
                />
              </Form.Item>
              <div className={classes.chartContainer} style={{ height: chartContainerHeight }}>
                <HostCpuAndRamChart
                  labels={data.hostResource.time}
                  cpu={data.hostResource.cpu}
                  ram={data.hostResource.ram}
                  legendPosition="top"
                  displayDataLabel={displayDataLabel}
                />
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane
          tab={
            <span>
              <HddOutlined />
              Storage
            </span>
          }
          key="storage"
        >
          Add chart here.
        </TabPane>
      </Tabs>
    </div>
  );
}

export default withStyles(styles)(Host);
