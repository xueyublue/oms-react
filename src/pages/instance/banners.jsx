import React, { useState, useEffect } from "react";
import { Table } from "antd";
import Loading from "../../components/Loading";

const columns = [
  {
    title: "Banner",
    dataIndex: "banner",
    key: "banner",
  },
];

const Banners = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_ROOT_URL}/instance/banners`);
      const result = await response.json();
      setData(result);
      setIsLoading(false);
    }
    setTimeout(() => {
      fetchData();
    }, 1000);
  }, []);

  if (isLoading) return <Loading />;

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

export default Banners;
