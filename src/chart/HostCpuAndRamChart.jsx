import React from "react";
import { Line } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function HostCpuAndRamChart({ labels, cpu, ram, displayTitle, legendPosition, displayData = false }) {
  const data = {
    labels: labels,
    datasets: [
      {
        label: `Host CPU (${cpu[0]}%)`,
        data: cpu,
        fill: true,
        borderColor: "rgb(36, 209, 209)",
        tension: 0.3,
        datalabels: {
          display: displayData,
          backgroundColor: "rgb(36, 209, 209)",
          color: "rgba(0,0,0,0.9)",
        },
      },
      {
        label: `Host RAM (${ram[0]}%)`,
        data: ram,
        fill: true,
        borderColor: "rgb(75, 122, 192)",
        tension: 0.3,
        datalabels: {
          display: displayData,
          backgroundColor: "rgb(75, 122, 192)",
          color: "white",
        },
      },
    ],
  };
  const options = {
    plugins: {
      title: { display: displayTitle, text: "Host CPU/RAM (every 5s)" },
      legend: {
        position: legendPosition ? legendPosition : "top",
      },
      datalabels: {
        display: displayData,
        font: { size: "14px" },
        borderRadius: 4,
        padding: 2,
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
  return <Line data={data} options={options} plugins={[ChartDataLabels]} />;
}

export default HostCpuAndRamChart;
