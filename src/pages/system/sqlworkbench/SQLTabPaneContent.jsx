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
import useFocus from "./../../../hooks/useFocus";
import axios from "axios";
import { BackendAPIContext } from "../../../context/BackendAPIContext";
import { API_FETCH_WAIT } from "../../../util/constants";
import Loading from "../../../components/Loading";
import useWindowDimensions from "../../../hooks/useWindowDimensions";
import { Table, Pagination } from "rsuite";

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
    //fontFamily: "Consolas, Menlo",
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
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);
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
        .get(`${baseUrl}/sql`, { params: { limit, sql } })
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
                  <Table
                    className={classes.table}
                    width={"100%"}
                    height={height - 395}
                    data={result.detail.filter((v, i) => {
                      const start = pageSize * (page - 1);
                      const end = start + pageSize;
                      return i >= start && i < end;
                    })}
                    bordered
                    cellBordered
                    headerHeight={30}
                    rowHeight={28}
                  >
                    {result.header.map((item) => (
                      <Table.Column
                        width={
                          item.length * 10 > 70
                            ? item === "REGIST_DATE"
                              ? "LAST_UPDATE_DATE".length * 10
                              : item.length * 10
                            : item === "KEYWORD"
                            ? 262
                            : 70
                        }
                        resizable
                      >
                        <Table.HeaderCell style={{ padding: 4, backgroundColor: "#FAFAFA", color: "black" }}>
                          {item}
                        </Table.HeaderCell>
                        <Table.Cell dataKey={item} style={{ padding: 4, fontSize: "12px" }} />
                      </Table.Column>
                    ))}
                  </Table>
                  <div style={{ paddingTop: 10 }}>
                    <Pagination
                      prev
                      next
                      first
                      last
                      ellipsis
                      boundaryLinks
                      maxButtons={5}
                      size="xs"
                      layout={["total", "-", "limit", "|", "pager", "skip"]}
                      total={result.detail.length}
                      limitOptions={[30, 50, 100]}
                      limit={pageSize}
                      activePage={page}
                      onChangePage={setPage}
                      onChangeLimit={(value) => {
                        setPage(1);
                        setPageSize(value);
                      }}
                    />
                  </div>
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
