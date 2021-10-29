import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "antd";
import axios from "axios";
import { withStyles } from "@mui/styles";
import Loading from "../components/Loading";
import ApiCallFailed from "../components/ApiCallFailed";
import { BackendAPIContext } from "../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../util/constants";
import HostCpuAndRamChart from "../components/chart/HostCpuAndRamChart";
import TablespaceOccupancyChart from "../components/chart/TablespaceOccupancyChart";
import DashboardCards from "../components/DashoardCards";
import SgaChart from "../components/chart/SgaChart";
import TablespaceSizeChart from "./../components/chart/TablespaceSizeChart";

//-------------------------------------------------------------
// STYLES START
//-------------------------------------------------------------
const styles = {
  root: {},
  chartContainer: {
    height: "340px",
    width: "100%",
  },
};

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Dashboard = ({ classes }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);

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

  return (
    <div className={classes.root}>
      <DashboardCards data={data} />
      <Row>
        <Col lg={24} xl={12} xxl={12}>
          <div className={classes.chartContainer}>
            <TablespaceOccupancyChart
              labels={data.tablespace.occupancyChart.name}
              data={data.tablespace.occupancyChart.data}
            />
          </div>
        </Col>
        <Col lg={24} xl={12} xxl={12}>
          <div className={classes.chartContainer}>
            <HostCpuAndRamChart
              labels={data.hostResource.time}
              cpu={data.hostResource.cpu}
              ram={data.hostResource.ram}
              legendPosition="right"
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={24} xl={12} xxl={12}>
          <div className={classes.chartContainer}>
            <TablespaceSizeChart
              labels={data.tablespace.totalSizeChart.name}
              data={data.tablespace.totalSizeChart.data}
            />
          </div>
        </Col>
        <Col lg={24} xl={12} xxl={12}>
          <div className={classes.chartContainer}>
            <SgaChart data={data.sgaConfig} legendPosition="right" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withStyles(styles)(Dashboard);
