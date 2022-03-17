import React from "react";
import { Col, Form, Badge, Overlay, Popover } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

class Picker extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showOptions: false,
      searchTerm: "",
      hoveredPickableIndex: -1,
      loggedInUserAdded: false,
    };
    this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
    this.getFilteredPickablesDom = this.getFilteredPickablesDom.bind(this);
    this.updateHoveredPickableIndex = this.updateHoveredPickableIndex.bind(
      this
    );
    this.removePickable = this.removePickable.bind(this);
  }

  removePickable(index) {
    this.props.modify(
      this.matchingPickables(
        this.props.pickables,
        this.props.selectors.filter((_, i) => index !== i)
      ).map((p) => p.id)
    );
  }

  updateHoveredPickableIndex(index) {
    this.setState({
      hoveredPickableIndex: index,
    });
  }

  matchingPickables(pickables, selectors) {
    return pickables.filter((p) => selectors.includes(p.id));
  }

  handleSearchTermChange(e) {
    this.setState({
      searchTerm: e.target.value,
      hoveredUserIndex: -1,
      showOptions: true,
    });
  }

  getFilteredPickablesDom() {
    const filteredPickables = this.props.pickables
      .filter((pickable) => !this.props.selectors.includes(pickable.id))
      .filter(
        (pickable) =>
          this.state.searchTerm &&
          pickable.name
            .toLowerCase()
            .includes(this.state.searchTerm.toLowerCase())
      )
      .slice(0, 5);

    return filteredPickables.length
      ? filteredPickables.map((pickable, index) => (
          <h5 key={index}>
            <Badge
              style={{ cursor: "pointer" }}
              variant={
                this.state.hoveredPickableIndex === index
                  ? "primary"
                  : "secondary"
              }
              onMouseOver={() => this.updateHoveredPickableIndex(index)}
              onMouseDown={(e) => {
                e.preventDefault();
                this.props.modify(
                  [
                    ...this.matchingPickables(
                      this.props.pickables,
                      this.props.selectors
                    ),
                    pickable,
                  ].map((p) => p.id)
                );
              }}
            >
              {pickable.name}
            </Badge>
          </h5>
        ))
      : "No matching results";
  }

  render() {
    return (
      <Form>
        <Form.Row>
          <Form.Group as={Col}>
            {this.matchingPickables(
              this.props.pickables,
              this.props.selectors
            ).map((tag, index) => (
              <Badge
                style={{ marginRight: "4px" }}
                key={index}
                variant="secondary"
              >
                {tag.name + " "}
                {this.props.readOnly ? null : (
                  <FontAwesomeIcon
                    icon={faTimes}
                    onClick={() => this.removePickable(index)}
                  />
                )}
              </Badge>
            ))}
            <div style={{ margin: "20px" }}></div>
            {this.props.readOnly ? null : (
              <div>
                <Form.Control
                  id="picker-input-box"
                  onChange={this.handleSearchTermChange}
                  onBlur={() => this.setState({ showOptions: false })}
                  placeholder={this.props.placeholderText || "Search Term"}
                  value={this.state.searchTerm}
                  autoComplete="off"
                />
                <Overlay
                  target={document.getElementById("picker-input-box")}
                  show={this.state.showOptions}
                  placement="bottom-start"
                >
                  <Popover id="popover-basic">
                    <Popover.Content>
                      {this.getFilteredPickablesDom()}
                    </Popover.Content>
                  </Popover>
                </Overlay>
              </div>
            )}
          </Form.Group>
        </Form.Row>
      </Form>
    );
  }
}

export default Picker;
