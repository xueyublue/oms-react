import React, { useState, useEffect } from "react";
import { withStyles } from "@mui/styles";
import { Modal, Table } from "antd";

const columns = [
  {
    title: "Con ID",
    dataIndex: "conId",
    key: "conId",
    width: 180,
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
    width: 180,
  },
  {
    title: "Object",
    dataIndex: "object",
    key: "object",
  },
];

//-------------------------------------------------------------
// STYLES START
//-------------------------------------------------------------
const styles = {
  root: {},
};

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
function SessionDetailModal({ classes, sessionId, show, onCancel }) {
  const [pageLoad, setPageLoad] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);

  return (
    <div className={classes.root}>
      <Modal title="Session Details" visible={show} onCancel={onCancel} width={800}>
        <Table
          columns={columns}
          dataSource={data}
          bordered
          size="small"
          pagination={{ pageSize: 15, position: ["none"] }}
          scroll={{ x: 700 }}
          rowKey="id"
        />
      </Modal>
    </div>
  );
}

export default withStyles(styles)(SessionDetailModal);
