import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Button, Select, Tag, Tooltip } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { FcUndo, FcSearch, FcSynchronize, FcDownload } from "react-icons/fc";

import { formatNumberWithCommas } from "../../util/util";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import ApiCallFailed from "../../components/ApiCallFailed";
import { API_FETCH_WAIT } from "../../util/constants";

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

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const TableRecords = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const ownerList = getDistinctOwners(data);
  const [owner, setOwner] = useState("All");
  const { baseUrl } = useContext(BackendAPIContext);

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/space/tablerecords`)
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
  }, [baseUrl]); //! eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;

  toast.info(`${data.length} records found.`);

  const filteredData = data.filter((row) => (owner === "All" ? true : row.owner === owner));

  return (
    <div>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item label="Owner" style={{ width: 200 }}>
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
          <Tooltip placement="right" title="Clear">
            <Button
              type="default"
              onClick={() => {
                setOwner("All");
              }}
            >
              <FcUndo size={22} />
            </Button>
          </Tooltip>
        </Form.Item>
        <div style={{ position: "absolute", right: 0 }}>
          <Form.Item>
            <Tooltip placement="bottom" title="Search">
              <Button
                type="text"
                icon={<FcSearch size={22} />}
                onClick={() => {
                  console.log("Search button clicked/");
                }}
                hidden
              />
            </Tooltip>
            <Tooltip placement="bottom" title="Refresh">
              <Button
                type="text"
                icon={<FcSynchronize size={22} />}
                onClick={() => {
                  setIsLoading(true);
                  fetchData();
                }}
              />
            </Tooltip>
            <Tooltip placement="bottom" title="Export">
              <Button
                type="text"
                icon={<FcDownload size={22} />}
                onClick={() => {
                  console.log("Export button clicked/");
                }}
              />
            </Tooltip>
          </Form.Item>
        </div>
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
        rowKey="tableName"
      />
    </div>
  );
};

export default TableRecords;
