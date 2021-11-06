import React, { useState } from "react";
import { Table, Tabs, Input, Button, Radio } from "antd";
import { withStyles } from "@mui/styles";
import { VscPlay, VscRunAll, VscDebugRestart, VscChevronLeft, VscChevronRight, VscHistory } from "react-icons/vsc";
import useFocus from "./../../../hooks/useFocus";

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
  const handleSqlQuery = () => {};
  const handleClear = () => {
    setSql("");
    setSqlInputFocus();
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
          placeholder="Intelligent SQL inputter (Not ready yet for now)."
          allowClear
          showCount
          size="small"
        />
      </div>
      <div className={classes.results}>
        <Tabs type="card" size="small">
          <TabPane tab={"Result"} key={"1"}>
            <Table
              columns={null}
              dataSource={null}
              className={classes.table}
              bordered
              size="small"
              scroll={{ x: 0, y: 0 }}
              pagination={{ pageSize: 10000, position: ["none"] }}
              rowKey={"id"}
            />
          </TabPane>
        </Tabs>
      </div>
    </div>
  );
}

export default withStyles(styles)(SQLTabPaneContent);
