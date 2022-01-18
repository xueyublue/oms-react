import React, { useState, useContext } from "react";
import { Tabs, Input, Button, Radio, Tooltip } from "antd";
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
import axios from "axios";
import useFocus from "../../../hooks/useFocus";
import { BackendAPIContext } from "../../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../../util/constants";
import Loading from "../../../components/Loading";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import SqlResultTable from "./SqlResultTable";

const { TabPane } = Tabs;

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
    fontFamily: "Calibri",
  },
  results: {
    marginTop: "5px",
  },
};

//-------------------------------------------------------------
// COMPONENT START
//-------------------------------------------------------------
function SQLTab({ classes }) {
  const [limit, setLimit] = useState(30);
  const [sql, setSql] = useState(
    "select * from dmitem;\n[KVs] select * from dnsystemkvs;\n[Shelf,10000] select * from dmshelfagc;\ndmarea;dmdevice;"
  );
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [sqlInputRef, setSqlInputFocus] = useFocus();
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
  const handleLimitChange = (e) => {
    setLimit(e.target.value);
  };
  const fetchData = async () => {
    setTimeout(() => {
      axios
        .get(`${baseUrl}/sql/query`, { params: { limit, sql } })
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
          <Radio.Group value={limit} onChange={handleLimitChange} buttonStyle="solid" size="small">
            <Radio.Button value={1}>1</Radio.Button>
            <Radio.Button value={30}>30</Radio.Button>
            <Radio.Button value={50}>50</Radio.Button>
            <Radio.Button value={100}>100</Radio.Button>
            <Radio.Button value={1000}>1K</Radio.Button>
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
                <TabPane tab={result.title} key={result.title}>
                  <SqlResultTable height={height - 395} result={result} />
                </TabPane>
              ))}
            </Tabs>
          </div>
        )
      )}
    </div>
  );
}

export default withStyles(styles)(SQLTab);
