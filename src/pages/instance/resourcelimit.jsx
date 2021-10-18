import React, { useState, useEffect } from "react";
import { Table, message, Tag } from "antd";
import Loading from "../../components/Loading";

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

const ResourceLimit = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.REACT_APP_API_ROOT_URL}/instance/resourcelimit`);
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    }
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, []);

  if (isLoading) return <Loading />;

  message.info(`${data.length} records found.`);

  return (
    <div>
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
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default ResourceLimit;
