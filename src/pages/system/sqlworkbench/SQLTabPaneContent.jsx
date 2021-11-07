import React, { useState, useContext } from "react";
import { Table, Tabs, Input, Button, Radio, Tooltip } from "antd";
import { withStyles } from "@mui/styles";
import {
  VscPlay,
  VscRunAll,
  VscClearAll,
  VscChevronLeft,
  VscChevronRight,
  VscHistory,
  VscWand,
  VscAdd,
  VscStarEmpty,
} from "react-icons/vsc";
import useFocus from "./../../../hooks/useFocus";
import axios from "axios";
import { BackendAPIContext } from "../../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../../util/constants";
import Loading from "../../../components/Loading";
import useWindowDimensions from "../../../hooks/useWindowDimensions";

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
    fontFamily: "Consolas, Menlo",
  },
  results: {
    marginTop: "5px",
  },
  table: {
    marginTop: "-17px",
  },
};

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
function SQLTabPaneContent({ classes }) {
  const [sqlInputRef, setSqlInputFocus] = useFocus();
  const [sql, setSql] = useState("[Item] select * from dmitem;\n[Stock] select * from dnstock;");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const { baseUrl } = useContext(BackendAPIContext);
  const { height } = useWindowDimensions();

  const handleSqlChange = (e) => setSql(e.target.value);
  const handleSqlQuery = () => {
    setIsLoading(true);
    fetchData();
  };
  const handleClear = () => {
    setSql("");
    setSqlInputFocus({ cursor: "end" });
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
        <Tooltip placement="top" title="Execute Selected">
          <Button type="text" icon={<VscPlay />} onClick={handleSqlQuery} />
        </Tooltip>
        <Tooltip placement="top" title="Execute All">
          <Button type="text" icon={<VscRunAll />} onClick={handleSqlQuery} />
        </Tooltip>
        <Tooltip placement="top" title="Clear">
          <Button type="text" icon={<VscClearAll />} onClick={handleClear} />
        </Tooltip>
        <Tooltip placement="top" title="Previous">
          <Button type="text" icon={<VscChevronLeft />} disabled />
        </Tooltip>
        <Tooltip placement="top" title="Next">
          <Button type="text" icon={<VscChevronRight />} disabled />
        </Tooltip>
        <Tooltip placement="top" title="History">
          <Button type="text" icon={<VscHistory />} disabled />
        </Tooltip>
        <Tooltip placement="top" title="Format">
          <Button type="text" icon={<VscWand />} disabled />
        </Tooltip>
        <Tooltip placement="top" title="Add to favorite">
          <Button type="text" icon={<VscAdd />} disabled />
        </Tooltip>
        <Tooltip placement="top" title="Favorites">
          <Button type="text" icon={<VscStarEmpty />} disabled />
        </Tooltip>
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
          value={sql}
          onChange={handleSqlChange}
          rows={5}
          placeholder="Intelligent SQL inputter (Not fully ready yet for now)."
          allowClear
          size="small"
          spellCheck={false}
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
                    scroll={{ x: 1000, y: height - 400 }}
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
