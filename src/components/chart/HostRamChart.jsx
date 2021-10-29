import React from "react";
import { Line } from "react-chartjs-2";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function HostRamChart({ labels, ram }) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "RAM",
        data: ram,
        fill: true,
        borderColor: "rgb(75, 122, 192)",
        tension: 0.3,
      },
    ],
  };
  const options = {
    plugins: {
      title: { display: true, text: "Host RAM (every 5s)" },
      legend: {
        display: false,
      },
    },
    animation: {
      duration: 500,
    },
    maintainAspectRatio: false,
    scales: {
      y: { beginAtZero: true, max: 100 },
      yAxes: [
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
  return <Line data={data} options={options} />;
}

export default HostRamChart;
