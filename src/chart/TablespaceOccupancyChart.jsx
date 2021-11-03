import React from "react";
import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function TablespaceOccupancyChart({ labels, data, displayData = false }) {
  let bgColors = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i] >= 80) bgColors[i] = "rgba(255, 178, 195, 0.8)";
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
      title: { display: true, text: "Tablespace Occupancy" },
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
      x: { beginAtZero: true, max: 100 },
      xAxes: [
        {
          ticks: {
            min: 0,
            max: 100,
            stepSize: 20,
          },
        },
      ],
    },
  };
  return <Bar data={dataSource} options={options} plugins={[ChartDataLabels]} />;
}

export default TablespaceOccupancyChart;
