import React, { useState, useEffect, useContext } from "react";
import { withStyles } from "@mui/styles";
import { Button, Modal, Tag } from "antd";
import axios from "axios";
import { BackendAPIContext } from "../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../util/constants";
import Loading from "./Loading";
import ApiCallFailed from "./ApiCallFailed";
import PageTable from "./PageTable";
import { formatNumberWithCommas } from "./../util/util";

const columns = [
  {
    header: "History Date",
    key: "histDate",
    width: 120,
  },
  {
    header: "Total Count",
    key: "count",
    width: 120,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => {
      let style = "default";
      if (value === 0) style = "default";
      else if (value < 10000) style = "green";
      else style = "gold";
      return (
        <Tag color={style} key={value} style={{ width: "100%", textAlign: "right" }}>
          {formatNumberWithCommas(value)}
        </Tag>
      );
    },
  },
  {
    header: "Daily Growth",
    key: "dailyGrowth",
    width: 120,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => {
      let style = "default";
      if (value === 0) style = "default";
      else if (value < 1000) style = "green";
      else style = "gold";
      return (
        <Tag color={style} key={value} style={{ width: "100%", textAlign: "right" }}>
          {formatNumberWithCommas(value)}
        </Tag>
      );
    },
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
function TableRecordsHistoryModal({ classes, tableName, show, onCancel }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);

  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/space/tablerecords/history`, { params: { owner: "WMS", tableName } })
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
        title="Table Records History"
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
            Owner: <Tag>WMS</Tag> TableName: <Tag>{tableName}</Tag>
          </strong>
        </div>
        <div className={classes.table}>
          <PageTable height={350} columns={columns} data={data} hidePagination />
        </div>
      </Modal>
    </div>
  );
}

export default withStyles(styles)(TableRecordsHistoryModal);
