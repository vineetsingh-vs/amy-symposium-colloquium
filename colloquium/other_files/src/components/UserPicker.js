import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  Badge,
  Button,
  Container,
  Form,
  Overlay,
  Popover,
  Row
} from "react-bootstrap";
import { authenticatedGetJson } from "../request";

class UserPicker extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showOptions: false,
      typedName: "",
      users: [],
      hoveredUserIndex: -1,
      loggedInUserAdded: false
    };
    this.handleNameChange = this.handleNameChange.bind(this);
    this.getFilteredUsersDom = this.getFilteredUsersDom.bind(this);
    this.updateHoveredUserIndex = this.updateHoveredUserIndex.bind(this);
    this.addSelectedUser = this.addSelectedUser.bind(this);
    this.addLoggedInUser = this.addLoggedInUser.bind(this);
    this.removeSelectedUserAt = this.removeSelectedUserAt.bind(this);
  }

  componentDidMount() {
    authenticatedGetJson("/v1/users").then((response) => {
      this.setState({ users: response });
    });

    this.setState({
      loggedInUserAdded: this.props.selectedUsers.some(
        (user) => user.id === this.props.loggedInUser.id
      )
    });
  }

  handleNameChange(e) {
    this.setState({
      typedName: e.target.value,
      hoveredUserIndex: -1,
      showOptions: true
    });
  }

  updateHoveredUserIndex(index) {
    this.setState({
      hoveredUserIndex: index
    });
  }

  addSelectedUser(user) {
    if (this.isLoggedInUser(user)) {
      this.setState({
        loggedInUserAdded: true
      });
    }

    this.props.updateSelectedUsers(this.props.selectedUsers.concat([user]));
  }

  addLoggedInUser() {
    this.setState({
      loggedInUserAdded: true
    });

    this.addSelectedUser(this.props.loggedInUser);
  }

  removeSelectedUserAt(index) {
    this.props.updateSelectedUsers(
      this.props.selectedUsers.filter((_, i) => index !== i)
    );

    const userBeingRemoved = this.props.selectedUsers[index];

    if (this.isLoggedInUser(userBeingRemoved)) {
      this.setState({
        loggedInUserAdded: false
      });
    }
  }

  isLoggedInUser(user) {
    return this.props.loggedInUser.id === user.id;
  }

  getFilteredUsersDom() {
    const filteredUsers = this.state.users
      .filter(
        (user) =>
          !this.props.selectedUsers.map((user) => user.name).includes(user.name)
      )
      .filter(
        (user) =>
          this.state.typedName &&
          user.name.toLowerCase().includes(this.state.typedName.toLowerCase())
      )
      .slice(0, 5);

    return filteredUsers.length
      ? filteredUsers.map((user, index) => (
          <h5 key={index}>
            <Badge
              style={{ cursor: "pointer" }}
              variant={
                this.state.hoveredUserIndex === index ? "primary" : "secondary"
              }
              onMouseOver={() => this.updateHoveredUserIndex(index)}
              onMouseDown={(e) => {
                e.preventDefault();
                this.addSelectedUser(user);
              }}
            >
              {user.name}
            </Badge>
          </h5>
        ))
      : "No matching users";
  }

  render() {
    return (
      <Container>
        <Row className="d-flex justify-content-between">
          <Form.Label>Authors</Form.Label>
          <Button
            variant="link"
            disabled={this.state.loggedInUserAdded}
            onClick={() => this.addLoggedInUser()}
          >
            Add me to paper
          </Button>
        </Row>
        <Row className="my-2">
          {this.props.selectedUsers.length ? (
            <h5>
              {this.props.selectedUsers.map((user, index) => (
                <Badge
                  style={{ marginRight: "4px" }}
                  key={index}
                  variant="secondary"
                >
                  {user.name + " "}
                  <FontAwesomeIcon
                    icon={faTimes}
                    style={{ cursor: "pointer" }}
                    onClick={() => this.removeSelectedUserAt(index)}
                  />
                </Badge>
              ))}
            </h5>
          ) : (
            <h5 className="text-muted">(No authors chosen)</h5>
          )}
        </Row>
        <Row>
          <Form.Control
            id="picker-input-box"
            onChange={this.handleNameChange}
            onBlur={() => this.setState({ showOptions: false })}
            placeholder="Search for contributors"
            value={this.state.typedName}
            autoComplete="off"
          />
          <Overlay
            target={document.getElementById("picker-input-box")}
            show={this.state.showOptions}
            placement="bottom-start"
          >
            <Popover id="popover-basic">
              <Popover.Content>{this.getFilteredUsersDom()}</Popover.Content>
            </Popover>
          </Overlay>
        </Row>
      </Container>
    );
  }
}

export default UserPicker;
