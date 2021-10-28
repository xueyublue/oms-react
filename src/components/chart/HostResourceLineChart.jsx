import React from "react";
import { Line } from "react-chartjs-2";

function HostResourceLineChart({ labels, cpu, ram }) {
  return (
    <Line
      type="line"
      data={{
        labels: labels,
        datasets: [
          {
            label: "CPU",
            data: cpu,
            fill: false,
            borderColor: "rgb(36, 209, 209)",
            tension: 0.3,
          },
          {
            label: "RAM",
            data: ram,
            fill: false,
            borderColor: "rgb(75, 122, 192)",
            tension: 0.3,
          },
        ],
      }}
      options={{
        title: { display: true, text: "Host System Resource Monitoring" },
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
        legend: {
          position: "right",
        },
      }}
    />
  );
}

export default HostResourceLineChart;
