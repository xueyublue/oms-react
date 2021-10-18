import React, { useState, useEffect } from "react";
import { Table, message, Tag } from "antd";
import Loading from "../../components/Loading";

const columns = [
  {
    title: "Role",
    dataIndex: "role",
    key: "role",
    width: 300,
  },
  {
    title: "Role ID",
    dataIndex: "roleId",
    key: "roleId",
    width: 150,
  },
  {
    title: "Password Required?",
    dataIndex: "passwordRequired",
    key: "passwordRequired",
    render: (passwordRequired) => (
      <Tag color={passwordRequired === "No" ? "green" : "geekblue"} key={passwordRequired}>
        {passwordRequired}
      </Tag>
    ),
  },
];

const Roles = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/user/roles`);
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

export default Roles;
