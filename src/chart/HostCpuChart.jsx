import React from "react";
import { Line } from "react-chartjs-2";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function HostCpuChart({ labels, cpu, displayTitle }) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: `Host CPU (${cpu[0]}%)`,
        data: cpu,
        fill: true,
        borderColor: "rgb(36, 209, 209)",
        tension: 0.3,
      },
    ],
  };
  const options = {
    plugins: {
      title: { display: displayTitle, text: "Host CPU (every 5s)" },
      legend: {
        position: "top",
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

export default HostCpuChart;
