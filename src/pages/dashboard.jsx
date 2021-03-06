import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "antd";
import axios from "axios";
import { withStyles } from "@mui/styles";
import { useSnackbar } from "notistack";
import Loading from "../components/Loading";
import ApiCallFailed from "../components/ApiCallFailed";
import { BackendAPIContext } from "../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../util/constants";
import HostCpuAndRamChart from "../chart/HostCpuAndRamChart";
import TablespaceOccupancyChart from "../chart/TablespaceOccupancyChart";
import DashboardCards from "../components/DashoardCards";
import SgaDoughnutChart from "../chart/SgaDoughnutChart";
import TablespaceSizeChart from "../chart/TablespaceSizeChart";
import useWindowDimensions from "./../hooks/useWindowDimensions";

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
const Dashboard = ({ classes }) => {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
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
  if (!data) {
    enqueueSnackbar("Failed to connect backend services. Please check the network connection.", {
      variant: "error",
      autoHideDuration: 5000,
    });
    return <ApiCallFailed />;
  }
  //* display snackbar only one time to inform the refresh interval
  if (!pageLoad) {
    setPageLoad(true);
    enqueueSnackbar("Dashboard loaded, refresh interval: 5 seconds.", {
      variant: "success",
      autoHideDuration: 5000,
    });
  }
  let chartContainerHeight = (height - 290) / 2;
  if (chartContainerHeight < 300) chartContainerHeight = 300;

  return (
    <div className={classes.root}>
      <DashboardCards data={data} />
      <Row>
        <Col lg={24} xl={12} xxl={12}>
          <div className={classes.chartContainer} style={{ height: chartContainerHeight }}>
            <TablespaceOccupancyChart
              labels={data.tablespace.occupancyChart.name}
              data={data.tablespace.occupancyChart.data}
              displayData
            />
          </div>
        </Col>
        <Col lg={24} xl={12} xxl={12}>
          <div className={classes.chartContainer} style={{ height: chartContainerHeight }}>
            <HostCpuAndRamChart
              labels={data.hostResource.time}
              cpu={data.hostResource.cpu}
              ram={data.hostResource.ram}
              legendPosition="top"
              displayDataLabel={true}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={24} xl={12} xxl={12}>
          <div className={classes.chartContainer} style={{ height: chartContainerHeight }}>
            <TablespaceSizeChart
              labels={data.tablespace.totalSizeChart.name}
              data={data.tablespace.totalSizeChart.data}
              displayData
            />
          </div>
        </Col>
        <Col lg={24} xl={12} xxl={12}>
          <div className={classes.chartContainer} style={{ height: chartContainerHeight }}>
            <SgaDoughnutChart data={data.sgaConfig} titleDisplay />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withStyles(styles)(Dashboard);
