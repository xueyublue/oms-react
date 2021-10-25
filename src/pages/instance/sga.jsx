import React, { useState, useEffect, useContext } from "react";
import { Table, Progress, Form, Button, Tooltip } from "antd";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { toast } from "react-toastify";
import { FcSynchronize } from "react-icons/fc";
import { formatNumberWithCommas } from "../../util/util";
import Loading from "../../components/Loading";
import ApiCallFailed from "../../components/ApiCallFailed";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../util/constants";
import ExportButton from "../../components/ExportButton";
import { getCsvHeaders } from "../../util/util";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 300,
  },
  {
    title: "Size",
    dataIndex: "size",
    key: "size",
    width: 180,
    align: "right",
    render: (value) => formatNumberWithCommas(value),
    sorter: (a, b) => a.size - b.size,
  },
  {
    title: "Percentage%",
    dataIndex: "percentage",
    key: "percentage",
    render: (percentage) => (
      <div>
        <Progress
          percent={percentage}
          status={percentage >= 80 ? "exception" : "normal"}
          strokeLinecap="square"
          format={(percentage) => `${percentage}`}
        />
      </div>
    ),
    sorter: (a, b) => a.percentage - b.percentage,
  },
];

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const SgaConfigurations = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/instance/sgaconfig`)
        .then(({ data }) => {
          setData(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setData(null);
          setIsLoading(false);
          console.log(err);
        });
    }, API_FETCH_WAIT);
  };

  useEffect(() => {
    fetchData();
  }, [baseUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  toast.info(`${data.table.length} records found.`);

  return (
    <div>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item />
        <div style={{ position: "absolute", right: 0 }}>
          <Form.Item>
            <Tooltip placement="bottom" title="Refresh">
              <Button
                type="text"
                icon={<FcSynchronize size={22} />}
                onClick={() => {
                  setIsLoading(true);
                  fetchData();
                }}
              />
            </Tooltip>
            <ExportButton
              csvReport={{
                data: data.table,
                headers: getCsvHeaders(columns),
                filename: "OMS_SGA.csv",
              }}
            />
          </Form.Item>
        </div>
      </Form>
      <div style={{ width: 800 }}>
        <Table
          columns={columns}
          dataSource={data.table}
          bordered
          size="small"
          pagination={{ pageSize: 15, position: ["none"] }}
          rowKey="name"
        />
      </div>
      <div style={{ height: "500" }}>
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
            title: { display: false, text: "SGA Configuration (" + data.maxSgaSize + "MB In Total)" },
            maintainAspectRatio: false,
            scales: {
              yAxes: [{ ticks: { display: false }, gridLines: { display: false } }],
            },
            legend: { position: "right" },
          }}
          height={300}
          width={600}
        />
      </div>
    </div>
  );
};

export default SgaConfigurations;
