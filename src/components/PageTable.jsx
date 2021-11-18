import React, { useState } from "react";
import { withStyles } from "@mui/styles";
import { Table, Pagination } from "rsuite";

//-------------------------------------------------------------
//* STYLES START
//-------------------------------------------------------------
const styles = {
  table: {},
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
      fontSize: "14px",
      fontWeight: 500,
    }}
  />
);
const BodyCell = (props) => <Table.Cell {...props} style={{ padding: 4, fontSize: "14px" }} />;

function PageTable({ classes, height, headerHeight = 32, rowHeight = 30, columns, data }) {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(30);

  return (
    <>
      <Table
        className={classes.table}
        width={"100%"}
        height={height}
        data={data.filter((v, i) => {
          const start = pageSize * (page - 1);
          const end = start + pageSize;
          return i >= start && i < end;
        })}
        bordered
        cellBordered
        headerHeight={headerHeight}
        rowHeight={rowHeight}
      >
        {columns.map((column) => (
          <Table.Column width={column.width} resizable>
            <HeaderCell>{column.renderHeader ? column.renderHeader(column.header) : column.header}</HeaderCell>
            <BodyCell>
              {(rowData) => {
                if (column.renderCell) return column.renderCell(rowData[column.key]);
                return rowData[column.key];
              }}
            </BodyCell>
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
          total={data.length}
          limitOptions={[30, 50, 100, 500]}
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

export default withStyles(styles)(PageTable);
