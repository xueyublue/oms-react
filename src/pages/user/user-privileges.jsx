import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Button, Select, Tag, Tooltip } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { FcUndo, FcSynchronize, FcDownload } from "react-icons/fc";
import ApiCallFailed from "../../components/ApiCallFailed";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../util/constants";

const columns = [
  {
    title: "User Name",
    dataIndex: "userName",
    key: "userName",
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

const getDistinctUserNames = (data) => {
  if (!data) return null;
  let userNameList = [];
  data.map((row) => row.userName && userNameList.push(row.userName));
  return ["All", ...new Set(userNameList)];
};

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const UserPrivileges = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [form] = Form.useForm();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const userNameList = getDistinctUserNames(data);
  const [userName, setUserName] = useState("All");
  const { baseUrl } = useContext(BackendAPIContext);

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/user/userprivileges`)
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
  }, [baseUrl]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <Loading />;
  if (!data) return <ApiCallFailed />;
  toast.info(`${data.length} records found.`);
  const filteredData = data.filter((row) => (userName === "All" ? true : row.userName === userName));

  return (
    <div>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item label="User Name" style={{ width: 240 }}>
          <Select
            value={userName}
            onChange={(value) => {
              setUserName(value);
            }}
          >
            {userNameList.map((userName) => (
              <Select.Option value={userName} key={userName}>
                {userName}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            onClick={() => {
              setUserName("All");
            }}
          >
            <FcUndo size={22} />
          </Button>
        </Form.Item>
        <div style={{ position: "absolute", right: 0 }}>
          <Form.Item>
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
                  console.log("Export button clicked");
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
        scroll={{ x: 1000 }}
        rowKey={(item) => `${item.userName}${item.privilege}`}
      />
    </div>
  );
};

export default UserPrivileges;
