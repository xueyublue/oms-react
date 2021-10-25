import React, { useState, useEffect, useContext } from "react";
import { Table, Form, Button, Tooltip } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import { FcSynchronize } from "react-icons/fc";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../util/constants";
import ExportButton from "../../components/ExportButton";
import { getCsvHeaders } from "../../util/util";

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

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/instance/banners`)
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
                  setIsLoading(true);
                  fetchData();
                }}
              />
            </Tooltip>
            <ExportButton
              csvReport={{
                data: data,
                headers: getCsvHeaders(columns),
                filename: "OMS_Banners.csv",
              }}
            />
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
