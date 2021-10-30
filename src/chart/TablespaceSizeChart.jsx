import React from "react";
import { Bar } from "react-chartjs-2";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function TablespaceSizeChart({ labels, data }) {
  let bgColors = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] >= 20480) bgColors[i] = "rgba(255, 178, 195, 0.8)";
    else if (data[i] >= 10240) bgColors[i] = "rgba(253, 211, 153, 0.8)";
    else bgColors[i] = "rgba(36, 209, 209, 0.8)";
  }
  const dataSource = {
    labels: labels,
    datasets: [
      {
        data: data,
        backgroundColor: bgColors,
        tension: 0.1,
        // borderColor: "rgba(36, 209, 209, 0.8)",
        // borderWidth: 1,
      },
    ],
  };
  const options = {
    plugins: {
      title: { display: true, text: "Tablespace Total Size (MB)" },
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    indexAxis: "y",
    scales: {
      x: { beginAtZero: true, max: data[0] },
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

export default TablespaceSizeChart;
