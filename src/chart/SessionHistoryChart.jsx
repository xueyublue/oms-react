import React, { useState, useEffect, useContext } from "react";
import { Form, DatePicker, Slider } from "antd";
import axios from "axios";
import { Line } from "react-chartjs-2";
import { useSnackbar } from "notistack";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { withStyles } from "@mui/styles";
import Loading from "../components/Loading";
import ApiCallFailed from "../components/ApiCallFailed";
import { BackendAPIContext } from "../context/BackendAPIContext";
import RefreshButton from "./../components/RefreshButton";
import { API_FETCH_WAIT } from "./../util/constants";
import moment from "moment";
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

const HISTORY_DATE_FORMAT = "DD-MM-YYYY";

const getMarks = () => {
  let marks = {};
  for (let index = 0; index <= 24; index++) {
    if (index < 12) marks[index] = index + ".am";
    else if (index === 12) marks[index] = index + ".pm";
    else marks[index] = index - 12 + ".pm";
  }
  return marks;
};

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
//* COMPONENT START
//-------------------------------------------------------------
function SessionHistoryChart({ classes }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [historyDate, setHistoryDate] = useState(moment().format(HISTORY_DATE_FORMAT));
  const [timeRange, setTimeRange] = useState([moment().format("HH"), parseInt(moment().format("HH")) + 1]);
  const { baseUrl } = useContext(BackendAPIContext);
  const { enqueueSnackbar } = useSnackbar();
  const [form] = Form.useForm();
  const { width } = useWindowDimensions();

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/sessions/history`, {
          params: { date: historyDate, format: HISTORY_DATE_FORMAT, startTime: timeRange[0], endTime: timeRange[1] },
        })
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
  }, [baseUrl, historyDate, timeRange]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleRefresh = () => {
    setHistoryDate(moment().format(HISTORY_DATE_FORMAT));
    setIsLoading(true);
    fetchData();
  };

  if (isLoading) return <Loading withinComponent />;
  if (!data) {
    enqueueSnackbar("Failed to connect backend services. Please check the network connection.", {
      variant: "error",
      autoHideDuration: 5000,
    });
    return <ApiCallFailed />;
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
        fill: false,
        borderColor: "rgb(36, 209, 209)",
        tension: 0.3,
      },
      {
        label: "Active",
        data: active,
        fill: false,
        borderColor: "rgb(253, 211, 100)",
        tension: 0.3,
      },
      {
        label: "Inactive",
        data: inactive,
        fill: false,
        borderColor: "rgb(75, 122, 192)",
        tension: 0.3,
      },
    ],
  };
  const options = {
    plugins: {
      legend: {
        position: "top",
      },
      datalabels: {
        display: false,
      },
    },
    stepped: false,
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
        <Form.Item label="Date">
          <DatePicker
            allowClear={false}
            defaultValue={moment()}
            format={HISTORY_DATE_FORMAT}
            onChange={(date, dateString) => setHistoryDate(dateString)}
            dateRender={(current) => {
              const style = {};
              if (current.date() === 1) {
                style.border = "1px solid #1890ff";
                style.borderRadius = "50%";
              }
              return (
                <div className="ant-picker-cell-inner" style={style}>
                  {current.date()}
                </div>
              );
            }}
          />
        </Form.Item>
        <Form.Item label="Time Range" style={{ width: width - 500 }}>
          <Slider
            onAfterChange={(value) => setTimeRange(value)}
            marks={getMarks()}
            range={{ draggableTrack: true }}
            min={0}
            max={24}
            defaultValue={timeRange}
          />
        </Form.Item>
        <div className={classes.tableTools}>
          <Form.Item>
            <RefreshButton onClick={handleRefresh} />
          </Form.Item>
        </div>
      </Form>
      <Line data={dataSource} options={options} plugins={[ChartDataLabels]} style={{ paddingBottom: 45 }} />
    </>
  );
}

export default withStyles(styles)(SessionHistoryChart);
