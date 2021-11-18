import React, { useState } from "react";
import { withStyles } from "@mui/styles";
import { Table, Pagination } from "rsuite";

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  root: {},
  table: {
    marginTop: "-17px",
  },
};

//-------------------------------------------------------------
//* COMPONENT START
//-------------------------------------------------------------
const HeaderCell = (props) => (
  <Table.HeaderCell
    {...props}
    style={{
      padding: 4,
      backgroundColor: "#FAFAFA",
      color: "black",
      fontSize: "12px",
      fontFamily: "Calibri",
    }}
  />
);
const BodyCell = (props) => <Table.Cell {...props} style={{ padding: 4, fontSize: "12px", fontFamily: "Calibri" }} />;

function SqlResultTable({ classes, height, result }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  return (
    <>
      <Table
        className={classes.table}
        width={"100%"}
        height={height}
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
        {result.header.map((item, index) => (
          <Table.Column width={result.chars[index] * 7.7 > 70 ? result.chars[index] * 7.7 : 70} resizable>
            <HeaderCell>{item}</HeaderCell>
            <BodyCell dataKey={item} />
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
    </>
  );
}

export default withStyles(styles)(SqlResultTable);
