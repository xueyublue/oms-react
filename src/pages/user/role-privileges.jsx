import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Button, Select, message, Tag } from "antd";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";

const columns = [
  {
    title: "Role Name",
    dataIndex: "role",
    key: "role",
    width: 300,
  },
  {
    title: "Privilege",
    dataIndex: "privilege",
    key: "privilege",
    width: 400,
  },
  {
    title: "Admin Option",
    dataIndex: "adminOption",
    key: "adminOption",
    render: (adminOption) => (
      <Tag color={adminOption === "No" ? "green" : "volcano"} key={adminOption}>
        {adminOption}
      </Tag>
    ),
  },
];

const getDistinctRoles = (data) => {
  if (!data) return null;
  let roleList = [];
  data.map((row) => row.role && roleList.push(row.role));
  return ["All", ...new Set(roleList)];
};

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const RolePrivileges = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const roleList = getDistinctRoles(data);
  const [role, setRole] = useState("All");
  const { baseUrl } = useContext(BackendAPIContext);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${baseUrl}/user/roleprivileges`);
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    }
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, []);

  if (isLoading) return <Loading />;

  const filteredData = data.filter((row) => (role === "All" ? true : row.role === role));
  message.info(`${data.length} records found.`);

  return (
    <div>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item label="Role Name" style={{ width: 240 }}>
          <Select
            value={role}
            onChange={(value) => {
              setRole(value);
            }}
          >
            {roleList.map((role) => (
              <Select.Option value={role} key={role}>
                {role}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              setRole("All");
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
        scroll={{ x: 1000 }}
      />
    </div>
  );
};

export default RolePrivileges;
