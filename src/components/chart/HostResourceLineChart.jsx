import React from "react";
import { Line } from "react-chartjs-2";

function HostResourceLineChart({ data }) {
  return (
    <Line
      type="line"
      data={data}
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
