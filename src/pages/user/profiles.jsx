import React, { useState, useEffect } from "react";
import { Table, Form, Button, Select, message, Tag } from "antd";
import Loading from "../../components/Loading";

const columns = [
  {
    title: "Profile",
    dataIndex: "profile",
    key: "profile",
    width: 160,
  },
  {
    title: "Resource Name",
    dataIndex: "resourceName",
    key: "resourceName",
    width: 300,
  },
  {
    title: "Resource Type",
    dataIndex: "resourceType",
    key: "resourceType",
    width: 140,
  },
  {
    title: "Limit",
    dataIndex: "limit",
    key: "limit",
    render: (limit) => (
      <Tag color={limit === "Unlimited" ? "green" : limit === "Default" ? "geekblue" : "volcano"} key={limit}>
        {limit}
      </Tag>
    ),
  },
];

const getDistinctProfiles = (data) => {
  if (!data) return null;
  let profiles = [];
  data.map((row) => row.profile && profiles.push(row.profile));
  return ["All", ...new Set(profiles)];
};

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Profiles = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const profileList = getDistinctProfiles(data);
  const [profile, setProfile] = useState("All");

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.REACT_APP_API_ROOT_URL}/user/profiles`);
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    }
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, []);

  if (isLoading) return <Loading />;

  const filteredData = data.filter((row) => (profile === "All" ? true : row.profile === profile));
  message.info(`${data.length} records found.`);

  return (
    <div>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item label="Profile" style={{ width: 240 }}>
          <Select
            value={profile}
            onChange={(value) => {
              setProfile(value);
            }}
          >
            {profileList.map((profile) => (
              <Select.Option value={profile} key={profile}>
                {profile}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              setProfile("All");
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
        scroll={{ x: 1300 }}
      />
    </div>
  );
};

export default Profiles;
