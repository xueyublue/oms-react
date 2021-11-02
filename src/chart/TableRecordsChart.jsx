import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import { Form, Select } from "antd";

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
function TableRecordsChart({ displayTitle, data, displayLimit, onDisplayLimitChange }) {
  const [form] = Form.useForm();
  const [type, setType] = useState("linear");

  if (!data) return;
  let labels = [];
  let records = [];
  let bgColors = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].totalRecords < 10000) bgColors[i] = "rgba(36, 209, 209, 0.8)";
    else bgColors[i] = "rgba(253, 211, 153, 0.8)";
    labels[i] = data[i].owner + "." + data[i].tableName;
    records[i] = data[i].totalRecords;
    if (i > displayLimit) break;
  }
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
    },
    maintainAspectRatio: false,
    indexAxis: "y",

    scales: {
      myScale: {
        type: type,
        position: "top",
        beginAtZero: true,
        min: 0,
        max: data[0].totalRecords,
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
      </Form>
      <Bar data={dataSource} options={options} />
    </>
  );
}

export default TableRecordsChart;
