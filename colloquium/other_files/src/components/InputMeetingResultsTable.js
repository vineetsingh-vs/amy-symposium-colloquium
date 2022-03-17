import React from "react";
import { Table } from "react-bootstrap";

class InputMeetingResultsTable extends React.Component {
  getColumnHeaders() {
    return this.props.headers
      ? this.props.headers.map(header => (
          <th className="text-center bg-light" key={header}>
            {header}
          </th>
        ))
      : "";
  }

  getTableRows() {
    return this.props.rows
      ? this.props.rows.map(row => (
          <tr key={row.index}>
            <td
              className={
                "text-center " + (this.props.freezeRowHeader ? "bg-light" : "")
              }
            >
              {row.index}
            </td>
            <td
              style={{
                position: this.props.freezeRowHeader ? "sticky" : "",
                left: "0px"
              }}
              className={
                "text-center " + (this.props.freezeRowHeader ? "bg-light" : "")
              }
            >
              {row.idea}
            </td>
            <td
              style={{
                position: this.props.freezeRowHeader ? "sticky" : "",
                left: "0px"
              }}
              className={
                "text-center " + (this.props.freezeRowHeader ? "bg-light" : "")
              }
            >
              {row.name}
            </td>
          </tr>
        ))
      : "";
  }

  render() {
    return this.props.rows && this.props.rows.length !== 0 ? (
      <div style={{ overflowX: "auto", marginBottom: "3rem" }}>
        <Table responsive="sm" style={{ marginTop: "3rem" }} width="100%">
          <thead>
            <tr>{this.getColumnHeaders()}</tr>
          </thead>
          <tbody>{this.getTableRows()}</tbody>
        </Table>
      </div>
    ) : (
      <h6>No results</h6>
    );
  }
}

export default InputMeetingResultsTable;
