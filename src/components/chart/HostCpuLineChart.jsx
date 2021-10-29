import React from "react";
import { Line } from "react-chartjs-2";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function HostCpuLineChart({ labels, cpu }) {
  return (
    <Line
      type="line"
      data={{
        labels: labels,
        datasets: [
          {
            label: "CPU",
            data: cpu,
            fill: true,
            borderColor: "rgb(36, 209, 209)",
            tension: 0.3,
          },
        ],
      }}
      options={{
        plugins: {
          title: { display: true, text: "Host CPU (every 5s)" },
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
      }}
    />
  );
}

export default HostCpuLineChart;