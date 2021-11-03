import React from "react";
import { Bar } from "react-chartjs-2";
import "chartjs-plugin-datalabels";
import ChartDataLabels from "chartjs-plugin-datalabels";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function SgaBarChart({ data, titleDisplay, chartType }) {
  const dataSource = {
    labels: data.chart.name,
    datasets: [
      {
        data: data.chart.data,
        backgroundColor: data.chart.backgroundColor,
        tension: 0.1,
        datalabels: {
          align: "end",
          anchor: "start",
        },
      },
    ],
  };
  const options = {
    plugins: {
      title: { display: titleDisplay, text: `SGA Configuration (${data.maxSgaSize}MB In Total)` },
      legend: {
        display: false,
      },
      datalabels: {
        color: "rgba(0,0,0,0.8)",
      },
    },
    maintainAspectRatio: false,
    indexAxis: "y",
    scales: {
      myScale: {
        type: chartType,
        position: "top",
        beginAtZero: true,
        min: 0,
        max: data.chart.data[0],
      },
    },
  };
  return <Bar data={dataSource} options={options} plugins={[ChartDataLabels]} />;
}

export default SgaBarChart;
