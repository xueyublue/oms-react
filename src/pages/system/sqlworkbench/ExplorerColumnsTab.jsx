import React, { useContext, useState, useEffect } from "react";
import { withStyles } from "@mui/styles";
import { Tag } from "antd";
import axios from "axios";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { BackendAPIContext } from "./../../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "./../../../util/constants";
import PageTable from "../../../components/PageTable";
import Loading from "../../../components/Loading";

const columns = [
  {
    header: "Name",
    key: "name",
    width: 300,
    fixed: true,
  },
  {
    header: "Date Type",
    key: "type",
    width: 200,
  },
  {
    header: "Primary Key",
    key: "primaryKey",
    width: 100,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => (
      <Tag
        color={value === "Yes" ? "geekblue" : "default"}
        key={value}
        style={{ width: "100%", height: "100%", textAlign: "center" }}
      >
        {value}
      </Tag>
    ),
  },
  {
    header: "Nullable?",
    key: "nullable",
    width: 100,
    renderHeader: (value) => <div style={{ textAlign: "center", width: "100%" }}>{value}</div>,
    renderCell: (value) => (
      <Tag
        color={value === "Yes" ? "default" : "geekblue"}
        key={value}
        style={{ width: "100%", height: "100%", textAlign: "center" }}
      >
        {value}
      </Tag>
    ),
  },
  {
    header: "Default",
    key: "default",
    width: 200,
  },
];

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    width: "100%",
    height: "100%",
    marginTop: -17,
  },
};

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
function ExplorerColumnsTab({ classes, table }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const { height } = useWindowDimensions();
  const { baseUrl } = useContext(BackendAPIContext);

  const fetchData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      axios
        .get(`${baseUrl}/sql/columns`, { params: { table } })
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
  }, [baseUrl, table]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={classes.root}>
      {isLoading ? <Loading withinComponent /> : <PageTable height={height - 245} columns={columns} data={data} />}
    </div>
  );
}

export default withStyles(styles)(ExplorerColumnsTab);
