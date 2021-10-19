import React, { useState, useEffect, useContext } from "react";
import { Table, message, Tag } from "antd";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";

const columns = [
  {
    title: "Parameter Name",
    dataIndex: "name",
    key: "name",
    width: 300,
    fixed: "left",
  },
  /*{
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 150,
  },*/
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
    fixed: "left",
    width: 300,
  },
  {
    title: "Description",
    dataIndex: "description",
    key: "description",
    width: 500,
  },
  {
    title: "Default?",
    dataIndex: "isDefault",
    key: "isDefault",
    width: 160,
    render: (value) => (
      <Tag color={value === "True" ? "green" : "geekblue"} key={value}>
        {value}
      </Tag>
    ),
  },
  {
    title: "Session Modificable?",
    dataIndex: "isSessionModifiable",
    key: "isSessionModifiable",
    width: 180,
    render: (value) => (
      <Tag color={value === "True" ? "green" : "geekblue"} key={value}>
        {value}
      </Tag>
    ),
  },
  {
    title: "System Modifucable?",
    dataIndex: "isSystemModifiable",
    key: "isSystemModifiable",
    width: 180,
    render: (value) => (
      <Tag color={value === "True" ? "green" : "geekblue"} key={value}>
        {value}
      </Tag>
    ),
  },
  {
    title: "Instance Modificable?",
    dataIndex: "isInstanceModifiable",
    key: "isInstanceModifiable",
    width: 180,
    render: (value) => (
      <Tag color={value === "True" ? "green" : "geekblue"} key={value}>
        {value}
      </Tag>
    ),
  },
];

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Parameters = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${baseUrl}/instance/parameters`);
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    }
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [baseUrl]);

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
        scroll={{ x: 1700, y: 700 }}
        rowKey="name"
      />
    </div>
  );
};

export default Parameters;
