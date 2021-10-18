import React, { useState, useEffect } from "react";
import { Table, Form, Button, Select, message, Tag } from "antd";
import { formatNumberWithCommas } from "../../util/util";
import Loading from "../../components/Loading";

const columns = [
  {
    title: "Owner",
    dataIndex: "owner",
    key: "owner",
    width: 200,
  },
  {
    title: "Table Name",
    dataIndex: "tableName",
    key: "tableName",
    width: 300,
  },
  {
    title: "Total Records",
    dataIndex: "totalRecords",
    key: "totalRecords",
    align: "right",
    width: 200,
    sorter: (a, b) => a.totalRecords - b.totalRecords,
    render: (value) => {
      let style = "green";
      if (value === 0) style = "default";
      else if (value < 1000) style = "green";
      else if (value < 10000) style = "green";
      else if (value < 1000000) style = "gold";
      else style = "magenta";
      return (
        <Tag color={style} key={value}>
          {formatNumberWithCommas(value)}
        </Tag>
      );
    },
  },
  {
    title: "Tablespace Name",
    dataIndex: "tablespace",
    key: "tablespace",
  },
];

const getDistinctOwners = (data) => {
  if (!data) return null;
  let owners = [];
  data.map((row) => row.owner && owners.push(row.owner));
  return ["All", ...new Set(owners)];
};

const TableRecords = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const ownerList = getDistinctOwners(data);
  const [owner, setOwner] = useState("All");

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.REACT_APP_API_ROOT_URL}/space/tablerecords`);
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    }
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, []);

  if (isLoading) return <Loading />;

  const filteredData = data.filter((row) => (owner === "All" ? true : row.owner === owner));
  message.info(`${data.length} records found.`);

  return (
    <div>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item label="Owner" style={{ width: 300 }}>
          <Select
            value={owner}
            onChange={(value) => {
              setOwner(value);
            }}
          >
            {ownerList.map((owner) => (
              <Select.Option value={owner} key={owner}>
                {owner}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            onClick={() => {
              setOwner("All");
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
        scroll={{ x: 1300 /*, y: 620 */ }}
      />
    </div>
  );
};

export default TableRecords;
