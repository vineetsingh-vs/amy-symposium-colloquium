import React from "react";
import Octicon, { ArrowUp, ArrowDown } from "@primer/octicons-react";
import {
  Table,
  Row,
  Col,
  Container,
  ButtonGroup,
  Button,
  ToggleButton
} from "react-bootstrap";
import "./RankingTable.css";

class RankingTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedProjectId: null
    };

    this.handleSelection = this.handleSelection.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
  }

  handleSelection(event) {
    this.setState({
      selectedProjectId: event.target.checked
        ? parseInt(event.target.value)
        : null
    });
  }

  moveUp(event) {
    const selected = this.props.projects.findIndex(
      p => p.proj_id === this.state.selectedProjectId
    );

    if (selected > 0 && selected < this.props.projects.length) {
      this.props.updateProjectsFunc(
        this.swapListItems(this.props.projects, selected - 1, selected)
      );
    }
  }

  moveDown(event) {
    const selected = this.props.projects.findIndex(
      p => p.proj_id === this.state.selectedProjectId
    );

    if (selected >= 0 && selected < this.props.projects.length - 1) {
      this.props.updateProjectsFunc(
        this.swapListItems(this.props.projects, selected, selected + 1)
      );
    }
  }

  swapListItems(list, firstIndex, secondIndex) {
    var list_copy = [...list];
    [list_copy[firstIndex], list_copy[secondIndex]] = [
      list_copy[secondIndex],
      list_copy[firstIndex]
    ];
    return list_copy;
  }

  getProjectRows() {
    if (this.props.projects && this.props.projects.length) {
      return this.props.projects.map((project, i) => {
        return (
          <tr key={i}>
            {this.props.showRankingColumn && <td>{i + 1}</td>}
            <td colSpan={this.props.showMoveButtons ? "2" : "1"}>
              <ButtonGroup toggle>
                <ToggleButton
                  className="d-flex"
                  variant="light"
                  type="checkbox"
                  checked={project.proj_id === this.state.selectedProjectId}
                  value={project.proj_id}
                  onChange={this.handleSelection}
                  disabled={!this.props.showMoveButtons}
                >
                  {this.props.projects[i].name}
                </ToggleButton>
              </ButtonGroup>
            </td>
          </tr>
        );
      });
    }
  }

  render() {
    const MoveButtonBar = () => (
      <th>
        <Row className="mr-auto ">
          <Col xs={2} className="justify-self-start">
            <Button variant="secondary" onClick={this.moveUp}>
              <Octicon icon={ArrowUp} size="small" ariaLabel="Move Up button" />
            </Button>
          </Col>
          <Col xs={2} className="justify-self-end">
            <Button variant="secondary" onClick={this.moveDown}>
              <Octicon
                icon={ArrowDown}
                size="small"
                ariaLabel="Move Down button"
              />
            </Button>
          </Col>
        </Row>
      </th>
    );

    return (
      <Container fluid>
        <Row>
          <Col>
            <Table bordered responsive-md="true" className="p-6">
              <thead className="thead-dark">
                <tr>
                  {this.props.showRankingColumn && (
                    <th>{this.props.labels[0]}</th>
                  )}
                  <th>{this.props.labels[1]}</th>
                  {this.props.showMoveButtons && <MoveButtonBar />}
                </tr>
              </thead>
              <tbody>{this.getProjectRows()}</tbody>
            </Table>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default RankingTable;
