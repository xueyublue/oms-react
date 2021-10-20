import React, { useState, useEffect, useContext } from "react";
import { Table, Tag } from "antd";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";

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

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${baseUrl}/instance/resourcelimit`);
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    }
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [baseUrl]);

  if (isLoading) return <Loading />;

  toast.info(`${data.length} records found.`);

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
        rowKey="resourceName"
      />
    </div>
  );
};

export default ResourceLimit;
