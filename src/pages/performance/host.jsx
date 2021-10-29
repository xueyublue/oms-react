import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@mui/styles";
import { Row, Col } from "antd";
import axios from "axios";
import Loading from "../../components/Loading";
import ApiCallFailed from "./../../components/ApiCallFailed";
import { API_FETCH_WAIT } from "../../util/constants";
import { BackendAPIContext } from "./../../context/BackendAPIContext";
import HostResourceLineChart from "../../components/chart/HostResourceLineChart";
import HostRamLineChart from "./../../components/chart/HostRamLineChart";
import HostCpuLineChart from "./../../components/chart/HostCpuLineChart";

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
function Host({ classes }) {
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
      <Row>
        <Col lg={24} xl={24} xxl={24}>
          <div className={classes.chartContainer}>
            <HostResourceLineChart
              labels={data.hostResource.time}
              cpu={data.hostResource.cpu}
              ram={data.hostResource.ram}
            />
          </div>
        </Col>
        <Col lg={24} xl={12} xxl={12}>
          <div className={classes.chartContainer}>
            <HostCpuLineChart labels={data.hostResource.time} cpu={data.hostResource.cpu} />
          </div>
        </Col>
        <Col lg={24} xl={12} xxl={12}>
          <div className={classes.chartContainer}>
            <HostRamLineChart labels={data.hostResource.time} ram={data.hostResource.ram} />
          </div>
        </Col>
      </Row>
    </div>
  );
}

export default withStyles(styles)(Host);
