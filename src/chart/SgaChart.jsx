import React from "react";
import { Doughnut } from "react-chartjs-2";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function SgaChart({ data, legendPosition }) {
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
      title: { display: true, text: `SGA Configuration (${data.maxSgaSize}MB In Total)` },
      legend: { position: legendPosition },
    },
    maintainAspectRatio: false,
    scales: {
      yAxes: [{ ticks: { display: false }, gridLines: { display: false } }],
    },
  };
  return <Doughnut data={dataSource} options={options} />;
}

export default SgaChart;
