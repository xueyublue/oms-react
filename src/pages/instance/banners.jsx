import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Button, Tooltip } from "antd";
import { toast } from "react-toastify";
import { FcSynchronize, FcExport } from "react-icons/fc";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";

const columns = [
  {
    title: "Banner",
    dataIndex: "banner",
    key: "banner",
  },
];

//-------------------------------------------------------------
// PAGE START
//-------------------------------------------------------------
const Banners = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const [form] = Form.useForm();

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${baseUrl}/instance/banners`);
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    }
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, [baseUrl]);

  if (isLoading) return <Loading />;

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
        rowKey="banner"
      />
    </div>
  );
};

export default Banners;
