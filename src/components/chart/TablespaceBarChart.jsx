import React from "react";
import { Bar } from "react-chartjs-2";

function TablespaceBarChart({ data }) {
  return (
    <Bar
      type="bar"
      data={data}
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
