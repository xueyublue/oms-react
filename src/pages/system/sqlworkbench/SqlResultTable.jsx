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
          <Table.Column width={result.chars[index] * 7.6 > 70 ? result.chars[index] * 7.5 : 70} resizable>
            <Table.HeaderCell
              style={{
                padding: 4,
                backgroundColor: "#FAFAFA",
                color: "black",
                fontSize: "12px",
                fontFamily: "consolas",
              }}
            >
              {item}
            </Table.HeaderCell>
            <Table.Cell dataKey={item} style={{ padding: 4, fontSize: "12px", fontFamily: "consolas" }} />
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
