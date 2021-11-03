import React from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function TablespaceSizeChart({ labels, data, displayData = false }) {
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
      },
    ],
  };
  const options = {
    plugins: {
      title: { display: true, text: "Tablespace Total Size (MB)" },
      legend: {
        display: false,
      },
      datalabels: {
        display: displayData,
        align: "end",
        anchor: "start",
        color: "rgba(0,0,0,0.7)",
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
  return <Bar data={dataSource} options={options} plugins={[ChartDataLabels]} />;
}

export default TablespaceSizeChart;
