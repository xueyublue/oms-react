import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { useSnackbar } from "notistack";
import Loading from "../components/Loading";
import ApiCallFailed from "../components/ApiCallFailed";
import { BackendAPIContext } from "../context/BackendAPIContext";

const getMaxValue = (data) => {
  let max = data[0];
  for (let d of data) {
    if (d >= max) max = d;
  }
  if (max < 100) max = 100;
  else if (max < 150) max = 150;
  else if (max < 200) max = 200;
  else max = 500;
  return max;
};

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function SessionChart({ titleDisplay, legendPosition, withinComponent }) {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();

  const fetchData = async () => {
    axios
      .get(`${baseUrl}/sessions/history`)
      .then(({ data }) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((err) => {
        setData(null);
        setIsLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 5000);
    return () => clearInterval(interval);
  }, [baseUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <Loading withinComponent />;
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
    enqueueSnackbar("Sessions loaded, refresh interval: 10 seconds.", {
      variant: "success",
      autoHideDuration: 5000,
    });
  }

  let maxValue = 100;
  if (data) maxValue = getMaxValue(data.total);
  const { labels, total, active, inactive } = data;
  const dataSource = {
    labels: labels,
    datasets: [
      {
        label: "Total",
        data: total,
        fill: true,
        borderColor: "rgb(36, 209, 209)",
        tension: 0.3,
      },
      {
        label: "Active",
        data: active,
        fill: true,
        borderColor: "rgb(253, 211, 100)",
        tension: 0.3,
      },
      {
        label: "Inactive",
        data: inactive,
        fill: true,
        borderColor: "rgb(75, 122, 192)",
        tension: 0.3,
      },
    ],
  };
  const options = {
    plugins: {
      title: { display: titleDisplay, text: "Sessions (every 10s)" },
      legend: {
        position: legendPosition === null ? "top" : legendPosition,
      },
    },
    stepped: true,
    animation: {
      duration: 500,
    },
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, max: maxValue },
    },
  };

  return <Line data={dataSource} options={options} />;
}

export default SessionChart;
