import React from "react";
import { Table } from "react-bootstrap";

class GroupRankingResultsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      optionNameDict: this.setOptionNameDict()
    };
  }

  setOptionNameDict() {
    var optionsDict = this.props.meeting.rankingOptions.reduce(function (
      map,
      obj
    ) {
      map[obj.option_id] = obj.option_name;
      return map;
    },
    {});
    return optionsDict;
  }

  getColumnHeaders() {
    return this.props.headers
      ? this.props.headers.map((header) => (
          <th className="text-center bg-light" key={header}>
            {header}
          </th>
        ))
      : "";
  }

  getTableRows() {
    return this.props.rows
      ? this.props.rows.map((row) => (
          <tr key={row.option_rank}>
            <td
              className={
                "text-center " + (this.props.freezeRowHeader ? "bg-light" : "")
              }
            >
              {row.option_rank}
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
              {this.state.optionNameDict[row.option_id]}
            </td>
          </tr>
        ))
      : "";
  }

  render() {
    return this.props.rows && this.props.rows.length !== 0 ? (
      <div style={{ overflowX: "auto" }}>
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

export default GroupRankingResultsTable;
