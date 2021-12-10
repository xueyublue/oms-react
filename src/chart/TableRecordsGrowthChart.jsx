import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Form, Select } from "antd";
import ChartDataLabels from "chartjs-plugin-datalabels";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function TableRecordsGrowthChart({ displayTitle, data, displayLimit, onDisplayLimitChange, displayData = true }) {
  const [form] = Form.useForm();
  const [type, setType] = useState("linear");
  const [growthType, setGrowthType] = useState("Daily");
  if (!data) return;
  let labels = [];
  let records = [];
  let bgColors = [];
  // sort data by growth
  const sortedData = [...data];
  sortedData.sort(function (a, b) {
    return b.dailyGrowth - a.dailyGrowth;
  });
  // build chart data
  for (let i = 0; i < sortedData.length; i++) {
    if (growthType === "Daily")
      if (sortedData[i].dailyGrowth < 1000) bgColors[i] = "rgba(36, 209, 209, 0.8)";
      else bgColors[i] = "rgba(253, 211, 153, 0.8)";
    else if (growthType === "Monthly")
      if (sortedData[i].monthlyGrowth < 1000 * 30) bgColors[i] = "rgba(36, 209, 209, 0.8)";
      else bgColors[i] = "rgba(253, 211, 153, 0.8)";
    else if (growthType === "Yearly")
      if (sortedData[i].yearlyGrowth < 1000 * 365) bgColors[i] = "rgba(36, 209, 209, 0.8)";
      else bgColors[i] = "rgba(253, 211, 153, 0.8)";
    labels[i] = sortedData[i].owner + "." + sortedData[i].tableName;
    if (growthType === "Daily") records[i] = sortedData[i].dailyGrowth;
    else if (growthType === "Monthly") records[i] = sortedData[i].monthlyGrowth;
    else if (growthType === "Yearly") records[i] = sortedData[i].yearlyGrowth;
    if (i > displayLimit) break;
  }
  // chart configurations
  const dataSource = {
    labels: labels,
    datasets: [
      {
        data: records,
        backgroundColor: bgColors,
        tension: 0.1,
      },
    ],
  };
  const options = {
    plugins: {
      title: { display: displayTitle, text: "Table Records" },
      legend: {
        display: false,
      },
      datalabels: {
        display: displayData,
        align: "end",
        anchor: "start",
        color: "rgba(0,0,0,0.7)",
      },
    },
    maintainAspectRatio: false,
    indexAxis: "y",
    scales: {
      myScale: {
        type: type,
        position: "top",
        beginAtZero: true,
        min: 0,
        max:
          growthType === "Daily"
            ? sortedData[0].dailyGrowth
            : growthType === "Monthly"
            ? sortedData[0].monthlyGrowth
            : sortedData[0].yearlyGrowth,
      },
    },
  };
  return (
    <>
      <Form form={form} layout={"inline"} size={"middle"} style={{ height: "35px" }}>
        <Form.Item label="Display Limit" style={{ width: 200 }}>
          <Select
            value={displayLimit}
            onChange={(value) => {
              onDisplayLimitChange(value);
            }}
          >
            {["All", 30, 50, 100, 200, 500].map((value) => (
              <Select.Option value={value} key={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Chart Type" style={{ width: 200 }}>
          <Select
            value={type}
            onChange={(value) => {
              setType(value);
            }}
          >
            {["Linear", "Logarithmic"].map((value) => (
              <Select.Option value={value.toLowerCase()} key={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="Growth Type" style={{ width: 200 }}>
          <Select
            value={growthType}
            onChange={(value) => {
              setGrowthType(value);
            }}
          >
            {["Daily", "Monthly", "Yearly"].map((value) => (
              <Select.Option value={value} key={value}>
                {value}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <Bar data={dataSource} options={options} plugins={[ChartDataLabels]} />
    </>
  );
}

export default TableRecordsGrowthChart;
