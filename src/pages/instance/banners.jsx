import React, { useState, useEffect, useContext } from "react";
import { Table, Form } from "antd";
import axios from "axios";
import { useSnackbar } from "notistack";
import Loading from "../../components/Loading";
import { BackendAPIContext } from "../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../util/constants";
import RefreshButton from "../../components/RefreshButton";
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
  const { enqueueSnackbar } = useSnackbar();

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

  const handleRefresh = () => {
    setIsLoading(true);
    fetchData();
  };

  if (isLoading) return <Loading />;
  enqueueSnackbar(`${data.length} records found.`, { variant: "info" });

  return (
    <div>
      <Form form={form} layout={"inline"} size={"middle"}>
        <Form.Item />
        <div style={{ position: "absolute", right: 0 }}>
          <Form.Item>
            <RefreshButton onClick={handleRefresh} />
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
        scroll={{ x: 600 }}
        rowKey="banner"
      />
    </div>
  );
};

export default Banners;
