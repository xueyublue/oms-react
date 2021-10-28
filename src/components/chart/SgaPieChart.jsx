import React from "react";
import { Pie } from "react-chartjs-2";

function SgaPieChart({ data, legendPosition }) {
  return (
    <Pie
      data={{
        labels: data.chart.name,
        datasets: [
          {
            data: data.chart.data,
            backgroundColor: data.chart.backgroundColor,
          },
        ],
      }}
      options={{
        title: { display: true, text: `SGA Configuration (${data.maxSgaSize}MB In Total)` },
        maintainAspectRatio: false,
        scales: {
          yAxes: [{ ticks: { display: false }, gridLines: { display: false } }],
        },
        legend: { position: legendPosition },
      }}
    />
  );
}

export default SgaPieChart;
