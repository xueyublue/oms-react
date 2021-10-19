import React, { useState, useEffect, useContext } from "react";
import { Table, message } from "antd";
import axios from "axios";
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
  const [isError, setIsError] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(`${baseUrl}/instance/details`);
        setData(response.data);
        setIsLoading(false);
        setIsError(false);
      } catch (error) {
        setData(null);
        setIsLoading(false);
        if (!isError) setIsError(true);
      }
    }
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, []);

  if (isLoading) return <Loading />;
  if (isError) return <ApiCallFailed />;

  message.info(`${data.length} records found.`);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        bordered
        size="small"
        pagination={{ pageSize: 15, position: ["none"] }}
      />
    </div>
  );
};

export default InstanceDetails;
