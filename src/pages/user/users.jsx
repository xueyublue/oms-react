import React, { useState, useEffect } from "react";
import { Table, Form, Button, Select, message, Tag } from "antd";
import { CheckCircleOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import Loading from "../../components/Loading";

const columns = [
  {
    title: "User Name",
    dataIndex: "userName",
    key: "userName",
    width: 200,
  },
  {
    title: "User ID",
    dataIndex: "userId",
    key: "userId",
    width: 120,
    sorter: (a, b) => a.userId - b.userId,
  },
  {
    title: "Status",
    dataIndex: "accountStatus",
    key: "accountStatus",
    width: 140,
    render: (status) => (
      <Tag
        color={status === "OPEN" ? "green" : "volcano"}
        icon={status === "OPEN" ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />}
        key={status}
      >
        {status}
      </Tag>
    ),
  },
  {
    title: "Profile",
    dataIndex: "profile",
    key: "profile",
    width: 100,
  },
  {
    title: "Default Tablespace",
    dataIndex: "defaultTablespace",
    key: "defaultTablespace",
    width: 150,
  },
  {
    title: "Temp Tablespace",
    dataIndex: "temporaryTablespace",
    key: "temporaryTablespace",
    width: 150,
  },
  {
    title: "Created Date",
    dataIndex: "createdDate",
    key: "createdDate",
    width: 170,
  },
  {
    title: "Expiry Date",
    dataIndex: "expiryDate",
    key: "expiryDate",
    width: 170,
  },
  {
    title: "Lock Date",
    dataIndex: "lockDate",
    key: "lockDate",
    width: 170,
  },
  {
    title: "Last Login Date",
    dataIndex: "lastLogin",
    key: "lastLogin",
  },
];

const getDistinctStatus = (data) => {
  if (!data) return null;
  let statusList = [];
  data.map((row) => row.accountStatus && statusList.push(row.accountStatus));
  return ["All", ...new Set(statusList)];
};

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Users = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const statusList = getDistinctStatus(data);
  const [status, setStatus] = useState("All");

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.REACT_APP_API_ROOT_URL}/user/users`);
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    }
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, []);

  if (isLoading) return <Loading />;

  const filteredData = data.filter((row) => (status === "All" ? true : row.accountStatus === status));
  message.info(`${data.length} records found.`);

  return (
    <div>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item label="Status" style={{ width: 240 }}>
          <Select
            value={status}
            onChange={(value) => {
              setStatus(value);
            }}
          >
            {statusList.map((status) => (
              <Select.Option value={status} key={status}>
                {status}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              setStatus("All");
            }}
          >
            CLEAR
          </Button>
        </Form.Item>
      </Form>
      <Table
        style={{ marginTop: 10 }}
        columns={columns}
        dataSource={filteredData}
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
        scroll={{ x: 1640 }}
      />
    </div>
  );
};

export default Users;
