import React, { useState, useEffect, useContext } from "react";
import { Form, Switch } from "antd";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { useSnackbar } from "notistack";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";
import Loading from "../components/Loading";
import ApiCallFailed from "../components/ApiCallFailed";
import { BackendAPIContext } from "../context/BackendAPIContext";
import useWindowDimensions from "./../hooks/useWindowDimensions";

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
function SessionMonitoringChart({ titleDisplay, legendPosition, withinComponent }) {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [displayDataLabel, setDisplayDataLabel] = useState(true);
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();
  const [form] = Form.useForm();
  const { width } = useWindowDimensions();

  const fetchData = async () => {
    axios
      .get(`${baseUrl}/sessions/monitoring`)
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
  // decide display limit
  const currentWidth = width - 220;
  const pxUnit = 1650 / 60;
  let length = currentWidth / pxUnit;
  if (length >= data.labels.length) length = data.labels.length;

  const { labels, total, active, inactive } = data;
  const dataSource = {
    labels: labels.slice(labels.length - length, labels.length),
    datasets: [
      {
        label: `Total (${total[total.length - 1]})`,
        data: total.slice(total.length - length, total.length),
        fill: false,
        borderColor: "rgb(36, 209, 209)",
        tension: 0.3,
        datalabels: {
          display: displayDataLabel,
          backgroundColor: "rgb(36, 209, 209)",
          color: "rgba(0,0,0,0.9)",
        },
      },
      {
        label: `Active (${active[active.length - 1]})`,
        data: active.slice(active.length - length, active.length),
        fill: false,
        borderColor: "rgb(253, 211, 100)",
        tension: 0.3,
        datalabels: {
          display: displayDataLabel,
          backgroundColor: "rgb(253, 211, 100)",
          color: "rgba(0,0,0,0.9)",
        },
      },
      {
        label: `Inactive (${inactive[inactive.length - 1]})`,
        data: inactive.slice(inactive.length - length, inactive.length),
        fill: false,
        borderColor: "rgb(75, 122, 192)",
        tension: 0.3,
        datalabels: {
          display: displayDataLabel,
          backgroundColor: "rgb(75, 122, 192)",
          color: "white",
        },
      },
    ],
  };
  const options = {
    plugins: {
      title: { display: titleDisplay, text: "Sessions (every 10s)" },
      legend: {
        position: legendPosition === null ? "top" : legendPosition,
      },
      datalabels: {
        display: displayDataLabel,
        borderRadius: 4,
        padding: 2,
      },
    },
    stepped: true,
    animation: {
      duration: 500,
    },
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: maxValue,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  return (
    <>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item label="Display Data Labels" style={{ width: 200 }}>
          <Switch
            checked={displayDataLabel}
            value={displayDataLabel}
            checkedChildren={<MdVisibility />}
            unCheckedChildren={<MdVisibilityOff />}
            onChange={(value) => {
              setDisplayDataLabel(value);
            }}
          />
        </Form.Item>
      </Form>
      <Line data={dataSource} options={options} plugins={[ChartDataLabels]} style={{ paddingBottom: 25 }} />
    </>
  );
}

export default SessionMonitoringChart;
