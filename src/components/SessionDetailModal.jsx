import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@mui/styles";
import { Button, Modal, Table, Tag } from "antd";
import axios from "axios";
import { BackendAPIContext } from "./../context/BackendAPIContext";
import { API_FETCH_WAIT } from "./../util/constants";
import Loading from "./Loading";
import ApiCallFailed from "./ApiCallFailed";

const columns = [
  {
    title: "Owner",
    dataIndex: "owner",
    key: "owner",
    width: 200,
  },
  {
    title: "Object",
    dataIndex: "object",
    key: "object",
    width: 240,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
];

//-------------------------------------------------------------
// STYLES START
//-------------------------------------------------------------
const styles = {
  root: {},
  info: {
    marginTop: "-15px",
    marginBottom: "10px",
  },
};

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
function SessionDetailModal({ classes, sessionId, show, onCancel }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/sessions/${sessionId}`)
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

  return (
    <div className={classes.root}>
      <Modal
        title="Session Accessing Objects"
        visible={show}
        ononCancel={onCancel}
        width={800}
        footer={[
          <Button key="back" type="primary" onClick={onCancel}>
            Close
          </Button>,
        ]}
      >
        <h4 className={classes.info}>
          Session ID: <Tag>{sessionId}</Tag> Total Accessing Objects: <Tag>{data.length}</Tag>
        </h4>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          size="small"
          pagination={{ pageSize: 1000, position: ["none"] }}
          scroll={{ x: 700, y: 300 }}
          rowKey="id"
        />
      </Modal>
    </div>
  );
}

export default withStyles(styles)(SessionDetailModal);
