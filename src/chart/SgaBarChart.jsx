import React from "react";
import { Bar } from "react-chartjs-2";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function SgaBarChart({ data, titleDisplay }) {
  const dataSource = {
    labels: data.chart.name,
    datasets: [
      {
        data: data.chart.data,
        backgroundColor: data.chart.backgroundColor,
        tension: 0.1,
      },
    ],
  };
  const options = {
    plugins: {
      title: { display: titleDisplay, text: `SGA Configuration (${data.maxSgaSize}MB In Total)` },
      legend: {
        display: false,
      },
    },
    maintainAspectRatio: false,
    indexAxis: "y",
    scales: {
      x: { beginAtZero: true, max: data.chart.data[0] },
    },
  };
  return <Bar data={dataSource} options={options} />;
}

export default SgaBarChart;
