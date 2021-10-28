import React from "react";
import { Bar } from "react-chartjs-2";

function TablespaceBarChart({ labels, data }) {
  return (
    <Bar
      type="bar"
      data={{
        labels: labels,
        datasets: [
          {
            data: data,
            borderColor: "rgb(36, 209, 209)",
            backgroundColor: "rgba(54, 162, 235, 0.5)",
            tension: 0.1,
          },
        ],
      }}
      options={{
        title: { display: true, text: "ORACLE Tablespace Occupancy" },
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
          display: false,
        },
      }}
    />
  );
}

export default TablespaceBarChart;
