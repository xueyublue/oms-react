import React from "react";
import { Bar } from "react-chartjs-2";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function TopIndexesChart({ displayTitle, data, limit }) {
  if (!data) return;
  let labels = [];
  let records = [];
  let bgColors = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].segmentSize < 1024) bgColors[i] = "rgba(36, 209, 209, 0.8)";
    else bgColors[i] = "rgba(253, 211, 153, 0.8)";
    labels[i] = data[i].owner + "." + data[i].segmentName;
    records[i] = data[i].segmentSize;
    if (i > limit) break;
  }
  const dataSource = {
    labels: labels,
    datasets: [
      {
        data: records,
        backgroundColor: bgColors,
        tension: 0.1,
      },
    ],
  };
  const options = {
    plugins: {
      title: { display: displayTitle, text: "Indexes" },
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    indexAxis: "y",
    scales: {
      myScale: {
        type: "linear", //logarithmic
        position: "top",
        beginAtZero: true,
        min: 0,
        max: data[0].segmentSize,
      },
    },
  };
  return <Bar data={dataSource} options={options} />;
}

export default TopIndexesChart;
