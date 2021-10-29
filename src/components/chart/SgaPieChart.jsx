import React from "react";
import { Pie } from "react-chartjs-2";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
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
        plugins: {
          title: { display: true, text: `SGA Configuration (${data.maxSgaSize}MB In Total)` },
          legend: { position: legendPosition },
        },
        maintainAspectRatio: false,
        scales: {
          yAxes: [{ ticks: { display: false }, gridLines: { display: false } }],
        },
      }}
    />
  );
}

export default SgaPieChart;
