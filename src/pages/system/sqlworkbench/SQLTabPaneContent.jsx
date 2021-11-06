import React, { useState, useContext } from "react";
import { Table, Tabs, Input, Button, Radio } from "antd";
import { withStyles } from "@mui/styles";
import { VscPlay, VscRunAll, VscDebugRestart, VscChevronLeft, VscChevronRight, VscHistory } from "react-icons/vsc";
import useFocus from "./../../../hooks/useFocus";
import axios from "axios";
import { BackendAPIContext } from "../../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../../util/constants";
import Loading from "../../../components/Loading";
import ApiCallFailed from "../../../components/ApiCallFailed";

const { TabPane } = Tabs;

const generateTableColumns = (header) => {
  let cols = [];
  header.map((h) => cols.push({ title: h, dataIndex: h, key: h }));
  return cols;
};

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {
    width: "100%",
    marginTop: "-10px",
  },
  buttons: {
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
  records: {
    marginLeft: "auto",
  },
  input: {
    width: "100%",
    fontFamily: "Consolas",
  },
  results: {
    marginTop: "5px",
  },
  table: {
    marginTop: "-15px",
  },
};

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
function SQLTabPaneContent({ classes }) {
  const [sqlInputRef, setSqlInputFocus] = useFocus();
  const [sql, setSql] = useState("SELECT * FROM DMITEM;");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);

  const handleSqlQuery = () => {
    setIsLoading(true);
    fetchData();
  };
  const handleClear = () => {
    setSql("");
    setSqlInputFocus();
  };
  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/sql`)
        .then(({ data }) => {
          setResults(data);
          setIsLoading(false);
        })
        .catch((err) => {
          setResults(null);
          setIsLoading(false);
          console.log(err);
        });
    }, API_FETCH_WAIT);
  };

  return (
    <div className={classes.root}>
      <div className={classes.buttons}>
        <Button type="text" icon={<VscPlay />} onClick={handleSqlQuery} />
        <Button type="text" icon={<VscRunAll />} onClick={handleSqlQuery} />
        <Button type="text" icon={<VscDebugRestart />} onClick={handleClear} />
        <Button type="text" icon={<VscChevronLeft />} />
        <Button type="text" icon={<VscChevronRight />} />
        <Button type="text" icon={<VscHistory />} />
        <div className={classes.records}>
          <Radio.Group defaultValue={10000} buttonStyle="solid" size="small">
            <Radio.Button value={1}>1</Radio.Button>
            <Radio.Button value={10}>10</Radio.Button>
            <Radio.Button value={100}>100</Radio.Button>
            <Radio.Button value={1000}>1K</Radio.Button>
            <Radio.Button value={10000}>10K</Radio.Button>
          </Radio.Group>
        </div>
      </div>
      <div className={classes.input}>
        <Input.TextArea
          ref={sqlInputRef}
          autoFocus
          value={sql}
          onChange={(e) => setSql(e.target.value.toUpperCase())}
          rows={5}
          placeholder="Intelligent SQL inputter (Not fully ready yet for now)."
          allowClear
          showCount
          size="small"
        />
      </div>
      {isLoading ? (
        <Loading />
      ) : (
        results && (
          <div className={classes.results}>
            <Tabs type="card" size="small">
              {results.map((result) => (
                <TabPane tab={`${result.title}(${result.detail.length})`} key={result.title}>
                  <Table
                    columns={generateTableColumns(result.header)}
                    dataSource={result.detail}
                    className={classes.table}
                    bordered
                    size="small"
                    scroll={{ x: 1000, y: 1000 }}
                    pagination={{ pageSize: 10000, position: ["none"] }}
                    rowKey={"ITEM_CODE"}
                  />
                </TabPane>
              ))}
            </Tabs>
          </div>
        )
      )}
    </div>
  );
}

export default withStyles(styles)(SQLTabPaneContent);
