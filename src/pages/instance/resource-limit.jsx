import React, { useState, useEffect, useContext } from "react";
import { Table, Tag, Form } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../util/constants";
import RefreshButton from "../../components/RefreshButton";
import ExportButton from "../../components/ExportButton";
import { getCsvHeaders } from "../../util/util";

const columns = [
  {
    title: "Resource Name",
    dataIndex: "resourceName",
    key: "resourceName",
    width: 300,
    sorter: (a, b) => a.resourceName > b.resourceName,
  },
  {
    title: "Current Utilization",
    dataIndex: "currentUtilization",
    key: "currentUtilization",
    width: 150,
    sorter: (a, b) => a.currentUtilization - b.currentUtilization,
  },
  {
    title: "Max Utilization",
    dataIndex: "maxUtilization",
    key: "maxUtilization",
    width: 150,
    sorter: (a, b) => a.maxUtilization - b.maxUtilization,
  },
  {
    title: "Initial Allocation",
    dataIndex: "initialAllocation",
    key: "initialAllocation",
    width: 150,
    sorter: (a, b) => a.initialAllocation - b.initialAllocation,
  },
  {
    title: "Limit Value",
    dataIndex: "limitValue",
    key: "limitValue",
    render: (limitValue) => (
      <Tag color={limitValue === "Unlimited" ? "green" : "geekblue"} key={limitValue}>
        {limitValue}
      </Tag>
    ),
  },
];

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const ResourceLimit = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/instance/resourcelimit`)
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
  toast.info(`${data.length} records found.`);

  return (
    <div>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item />
        <div style={{ position: "absolute", right: 0 }}>
          <Form.Item>
            <RefreshButton
              onClick={() => {
                setIsLoading(true);
                fetchData();
              }}
            />
            <ExportButton
              csvReport={{
                data: data,
                headers: getCsvHeaders(columns),
                filename: "OMS_ResourceLimit.csv",
              }}
            />
          </Form.Item>
        </div>
      </Form>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        size="small"
        pagination={{
          page: page,
          pageSize: pageSize,
          position: ["bottomRight"],
          pageSizeOptions: [10, 15, 30, 100, 500],
          onChange: (p, size) => {
            setPage(p);
            setPageSize(size);
          },
        }}
        scroll={{ x: 1000 }}
        rowKey="resourceName"
      />
    </div>
  );
};

export default ResourceLimit;
