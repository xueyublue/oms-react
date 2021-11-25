import React, { useContext, useState, useEffect } from "react";
import { withStyles } from "@mui/styles";
import axios from "axios";
import { Input } from "antd";
import { BackendAPIContext } from "./../../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "./../../../util/constants";
import Loading from "../../../components/Loading";

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    width: "100%",
    height: "100%",
    marginTop: -17,
  },
  input: {
    fontFamily: "Calibri",
  },
};

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
function ExplorerSqlSourceTab({ classes, table }) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);

  const fetchData = async () => {
    setIsLoading(true);
    setTimeout(() => {
      axios
        .get(`${baseUrl}/sql/sqlSource`, { params: { table } })
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
      {isLoading ? (
        <Loading withinComponent />
      ) : (
        <div className={classes.input}>
          <Input.TextArea readOnly value={data ? data.data : null} rows={32} size="small" spellCheck={false} />
        </div>
      )}
    </div>
  );
}

export default withStyles(styles)(ExplorerSqlSourceTab);
