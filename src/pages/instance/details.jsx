import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Button, Tooltip } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { FcSynchronize, FcExport } from "react-icons/fc";
import Loading from "../../components/Loading";
import ApiCallFailed from "../../components/ApiCallFailed";
import { BackendAPIContext } from "../../context/BackendAPIContext";

const columns = [
  {
    title: "Field",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Value",
    dataIndex: "value",
    key: "value",
  },
];

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const InstanceDetails = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${baseUrl}/instance/details`);
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
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item />
        <div style={{ position: "absolute", right: 0 }}>
          <Form.Item>
            <Tooltip placement="bottom" title="Refresh">
              <Button
                type="text"
                icon={<FcSynchronize size={22} />}
                onClick={() => {
                  console.log("Refresh button clicked/");
                }}
              />
            </Tooltip>
            <Tooltip placement="bottom" title="Export">
              <Button
                type="text"
                icon={<FcExport size={22} />}
                onClick={() => {
                  console.log("Export button clicked/");
                }}
              />
            </Tooltip>
          </Form.Item>
        </div>
      </Form>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        size="small"
        pagination={{ pageSize: 15, position: ["none"] }}
        rowKey="name"
      />
    </div>
  );
};

export default InstanceDetails;
