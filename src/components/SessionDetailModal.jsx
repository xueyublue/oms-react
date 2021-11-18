import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@mui/styles";
import { Button, Modal, Table, Tag } from "antd";
import { UserOutlined, SyncOutlined } from "@ant-design/icons";
import axios from "axios";
import { BackendAPIContext } from "./../context/BackendAPIContext";
import { API_FETCH_WAIT } from "./../util/constants";
import Loading from "./Loading";
import ApiCallFailed from "./ApiCallFailed";
import PageTable from "./PageTable";

const columns = [
  {
    header: "Owner",
    key: "owner",
    width: 150,
  },
  {
    header: "Type",
    key: "type",
    width: 180,
    renderCell: (type) => (
      <Tag
        color={type === "TABLE" || type === "VIEW" ? "success" : "gold"}
        key={type}
        style={{ width: "100%", textAlign: "center" }}
      >
        {type}
      </Tag>
    ),
  },
  {
    header: "Object",
    key: "object",
    width: 420,
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
        <div className={classes.info}>
          <strong>
            Session ID: <Tag>{sessionId}</Tag> Total Accessing Objects: <Tag>{data.length}</Tag>
          </strong>
        </div>
        <div className={classes.table}>
          <PageTable height={350} columns={columns} data={data} hidePagination />
        </div>
      </Modal>
    </div>
  );
}

export default withStyles(styles)(SessionDetailModal);
