import React, { useContext, useState, useEffect } from "react";
import { withStyles } from "@mui/styles";
import { Tag } from "antd";
import axios from "axios";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { BackendAPIContext } from "../../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../../util/constants";
import PageTable from "../../../components/PageTable";
import Loading from "../../../components/Loading";

const columns = [
  {
    header: "Owner",
    key: "owner",
    width: 200,
    fixed: true,
  },
  {
    header: "Table Name",
    key: "tableName",
    width: 300,
  },
  {
    header: "Total Records",
    key: "totalRecords",
    width: 135,
    renderCell: (value) => {
      let style = "default";
      if (value === 0) style = "default";
      else if (value < 10000) style = "green";
      else style = "gold";
      return (
        <Tag color={style} key={value} style={{ width: "100%", textAlign: "right" }}>
          {value}
        </Tag>
      );
    },
  },
  {
    header: "Tablespace Name",
    key: "tablespace",
    width: 250,
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
function ExplorerDataTab({ classes, table }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const { height } = useWindowDimensions();
  const { baseUrl } = useContext(BackendAPIContext);

  const fetchData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      axios
        .get(`${baseUrl}/space/tablerecords`)
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
      {isLoading ? <Loading /> : <PageTable height={height - 245} columns={columns} data={data} />}
    </div>
  );
}

export default withStyles(styles)(ExplorerDataTab);
