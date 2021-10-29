import React, { useState, useEffect, useContext } from "react";
import { Row, Col } from "antd";
import axios from "axios";
import { withStyles } from "@mui/styles";
import Loading from "../components/Loading";
import ApiCallFailed from "../components/ApiCallFailed";
import { BackendAPIContext } from "../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../util/constants";
import HostResourceLineChart from "../components/chart/HostResourceLineChart";
import TablespaceBarChart from "../components/chart/TablespaceBarChart";
import DashboardCards from "../components/DashoardCards";
import SgaPieChart from "../components/chart/SgaPieChart";

//-------------------------------------------------------------
// STYLES START
//-------------------------------------------------------------
const styles = {
  root: {},
  chartContainer: {
    height: "300px",
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
    }, API_FETCH_WAIT);
    return () => clearInterval(interval);
  }, [baseUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;

  return (
    <div className={classes.root}>
      <DashboardCards data={data} />
      <Row>
        <Col lg={24} xl={24} xxl={12}>
          <div className={classes.chartContainer}>
            <TablespaceBarChart labels={data.tablespace.label} data={data.tablespace.data} />
          </div>
        </Col>
        <Col lg={24} xl={24} xxl={12}>
          <div className={classes.chartContainer}>
            <HostResourceLineChart
              labels={data.hostResource.label}
              cpu={data.hostResource.cpu}
              ram={data.hostResource.ram}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col lg={24} xl={24} xxl={12}>
          <div className={classes.chartContainer}>
            <TablespaceBarChart labels={data.tablespace.label} data={data.tablespace.data} />
          </div>
        </Col>
        <Col lg={24} xl={24} xxl={12}>
          <div className={classes.chartContainer}>
            <SgaPieChart data={data.sgaconfig} legendPosition="right" />
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default withStyles(styles)(Dashboard);
