import React, { useState, useEffect, useContext } from "react";
import { Table, Progress, Tag, Button, Form, Tooltip } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import axios from "axios";
import { toast } from "react-toastify";
import { FcSynchronize, FcDownload, FcUndo } from "react-icons/fc";
import { formatNumberWithCommas } from "../../util/util";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import ApiCallFailed from "../../components/ApiCallFailed";
import { API_FETCH_WAIT } from "../../util/constants";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
    width: 120,
    sorter: (a, b) => a.name > b.name,
  },
  {
    title: "Path",
    dataIndex: "path",
    key: "path",
    width: 200,
    sorter: (a, b) => a.path > b.path,
  },
  {
    title: "Status",
    dataIndex: "status",
    key: "status",
    width: 80,
    align: "center",
    render: (status) => (
      <Tag
        color={status === "Online" ? "green" : "volcano"}
        icon={status === "Online" ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
        key={status}
      >
        {status}
      </Tag>
    ),
  },
  {
    title: "Size (MB)",
    dataIndex: "size",
    key: "size",
    width: 100,
    align: "right",
    render: (value) => formatNumberWithCommas(value),
    sorter: (a, b) => a.size - b.size,
  },
  {
    title: "Free Size (MB) ",
    dataIndex: "freeSize",
    key: "freeSize",
    width: 120,
    align: "right",
    render: (value) => formatNumberWithCommas(value),
    sorter: (a, b) => a.freeSize - b.freeSize,
  },
  {
    title: "Occupancy",
    dataIndex: "occupancy",
    key: "occupancy",
    width: 140,
    align: "center",
    render: (text) => (
      <Progress
        percent={text}
        status={text >= 80 ? "exception" : "normal"}
        strokeLinecap="square"
        format={(percent) => `${percent}%`}
      />
    ),
    sorter: (a, b) => a.occupancy - b.occupancy,
  },
  {
    title: "Auto Extend?",
    dataIndex: "autoExtensible",
    key: "autoExtensible",
    width: 100,
    align: "center",
    render: (autoExtensible) => (
      <Tag color={autoExtensible === "Yes" ? "green" : "volcano"} key={autoExtensible}>
        {autoExtensible}
      </Tag>
    ),
  },
  {
    title: "Next Extend (MB)",
    dataIndex: "nextExtend",
    key: "nextExtend",
    width: 140,
    align: "right",
    render: (value) => formatNumberWithCommas(value),
  },
  {
    title: "Contents",
    dataIndex: "contents",
    key: "contents",
    width: 100,
  },
  {
    title: "Allocation Type",
    dataIndex: "allocationType",
    key: "allocationType",
    width: 120,
  },
];

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Tablespace = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/space/tablespace`)
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
  }, [baseUrl]);

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  toast.info(`${data.length} records found.`);

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
            <Tooltip placement="bottom" title="Export">
              <Button
                type="text"
                icon={<FcDownload size={22} />}
                onClick={() => {
                  console.log("Export button clicked");
                }}
              />
            </Tooltip>
          </Form.Item>
        </div>
      </Form>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        size="small"
        pagination={{ pageSize: 15, position: ["none"] }}
        scroll={{ x: 1300 }}
        rowKey="name"
      />
    </div>
  );
};

export default Tablespace;
