import React, { useState, useEffect, useContext } from "react";
import { Table, Tag } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import ApiCallFailed from "../../components/ApiCallFailed";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";

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

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Roles = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/user/roles`);
        setData(response.data);
        setIsLoading(false);
      } catch (error) {
        setData(null);
        setIsLoading(false);
      }
    };
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [baseUrl]);

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;

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
        rowKey="role"
      />
    </div>
  );
};

export default Roles;
