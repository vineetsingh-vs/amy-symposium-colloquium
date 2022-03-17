import Octicon, { IssueOpened } from "@primer/octicons-react";
import React from "react";
import { Col, Container, Row, Table } from "react-bootstrap";
import { Scatter } from "react-chartjs-2";

// TODO: Depends on the number of options
const warningThreshold = 6;

class IndividualRankingResultsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      plotPointsMap: new Map(),
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

  componentDidMount() {
    const individualRankings = this.props.rows;
    let optionVsIndividualRankMap = new Map();

    individualRankings.forEach((element) => {
      let map = new Map();
      var points = [];
      element.stats.forEach((rank, index) => {
        optionVsIndividualRankMap.set(element.option_id, []);
        map.has(rank[0])
          ? map.get(rank[0]).count++
          : map.set(rank[0], { count: 1 });

        var point = {
          x: rank[0],
          y: map.get(rank[0]).count,
          mine: rank[1]
        };

        points.push(point);
      });

      var hasOutlier = false;
      var range = {
        min: individualRankings.length + 1,
        max: 0
      };

      // mode is the element that is repeated most often. In this case, the rank with highest # votes.
      var mode = {
        rank: 0,
        count: 0
      };

      map.forEach((v, k) => {
        if (v.count > mode.count) {
          mode.count = v.count;
          mode.rank = k;
        }

        if (k < range.min) {
          range.min = k;
        }

        if (k > range.max) {
          range.max = k;
        }
      });

      let warningMessage = "";
      if (mode.count > 1) {
        hasOutlier =
          mode.rank - range.min >= warningThreshold ||
          range.max - mode.rank >= warningThreshold;
        warningMessage = hasOutlier ? "Outlier rank found" : null;
      } else {
        hasOutlier = range.max - range.min >= warningThreshold;
        warningMessage = hasOutlier ? "High difference in ranks" : null;
      }

      optionVsIndividualRankMap.set(element.option_id, {
        points: points,
        warning: warningMessage
      });
    });

    this.setState({
      plotPointsMap: optionVsIndividualRankMap
    });
  }

  getPlotRow(option_id) {
    const chart =
      this.state.plotPointsMap.size > 0
        ? this.state.plotPointsMap.get(option_id)
        : {};
    const plotPoints = chart.points || [];
    const outlier = chart.warning || null;

    const options = {
      tooltips: {
        enabled: false
      },
      legend: {
        display: false
      },
      animation: {
        duration: 0
      },
      scales: {
        xAxes: [
          {
            ticks: {
              min: 1,
              max: this.props.rows.length,
              stepSize: 1
            }
          }
        ],
        yAxes: [
          {
            ticks: {
              min: 1,
              max: 5,
              stepSize: 5,
              display: true
            },
            display: false
          }
        ]
      }
    };

    const myDataFunc = (ifmine, otherwise) => {
      return (context) => {
        return context.dataset.data[context.dataIndex].mine
          ? ifmine
          : otherwise;
      };
    };
    const data = {
      datasets: [
        {
          fill: true,
          pointBorderColor: myDataFunc("red", "blue"),
          pointBackgroundColor: "#fff",
          pointBorderWidth: myDataFunc(3, 1),
          pointHoverRadius: 5,
          pointHoverBackgroundColor: "rgba(75,192,192,1)",
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 3,
          pointHitRadius: 10,
          showLine: false,
          data: plotPoints
        }
      ]
    };

    return (
      <tr className="statRow">
        <td>
          <Container className="plot">
            <Scatter
              data={data}
              options={options}
              height={100}
              redraw
            ></Scatter>
          </Container>
        </td>

        <td>
          {outlier ? (
            <Row>
              <Col xs={1}>
                <Octicon
                  icon={IssueOpened}
                  size="medium"
                  verticalAlign="middle"
                  ariaLabel="Move Up button"
                />
              </Col>
              <Col>
                <p>{outlier}</p>
              </Col>
            </Row>
          ) : null}
        </td>
      </tr>
    );
  }

  getTableRows() {
    return this.props.rows
      ? this.props.rows.map((row) => (
          <tr key={row.option_rank}>
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
            <td>
              <Table bordered>
                <tbody>{this.getPlotRow(row.option_id)}</tbody>
              </Table>
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

export default IndividualRankingResultsTable;
