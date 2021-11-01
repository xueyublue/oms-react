import React from "react";
import { Bar } from "react-chartjs-2";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function TableRecordsChart({ displayTitle, data, limit }) {
  if (!data) return;
  let labels = [];
  let records = [];
  let bgColors = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].totalRecords < 10000) bgColors[i] = "rgba(36, 209, 209, 0.8)";
    else bgColors[i] = "rgba(253, 211, 153, 0.8)";
    labels[i] = data[i].owner + "." + data[i].tableName;
    records[i] = data[i].totalRecords;
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
      title: { display: displayTitle, text: "Table Records" },
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    indexAxis: "y",
    scales: {
      x: { beginAtZero: true, min: 0, max: data[0].totalRecords },
      xAxes: [
        {
          ticks: {
            min: 0,
          },
        },
      ],
    },
  };
  return <Bar data={dataSource} options={options} />;
}

export default TableRecordsChart;
