import React from "react";
import { Doughnut } from "react-chartjs-2";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function SgaDoughnutChart({ data, titleDisplay }) {
  const dataSource = {
    labels: data.chart.name,
    datasets: [
      {
        data: data.chart.data,
        backgroundColor: data.chart.backgroundColor,
      },
    ],
  };
  const options = {
    plugins: {
      title: { display: titleDisplay, text: `SGA Configuration (${data.maxSgaSize}MB In Total)` },
      legend: { position: "right" },
    },
    maintainAspectRatio: false,
    // scales: {
    //   yAxes: [{ ticks: { display: false }, gridLines: { display: false } }],
    // },
  };
  return <Doughnut data={dataSource} options={options} />;
}

export default SgaDoughnutChart;
