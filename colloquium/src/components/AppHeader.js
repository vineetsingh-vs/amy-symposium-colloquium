import React from "react";
import { Button, Navbar } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { PATHS, URI_GENERATORS } from "../AppRouter";
import "../css/AppHeader.css";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { logout } from "../request";
import ColloquiumLogo from "../assets/FullTransparent.png";

class AppHeader extends React.Component {
  constructor(props) {
    super(props);
    this.handleEventCreation = this.handleEventCreation.bind(this);
    this.handleLogout = this.handleLogout.bind(this)
  }

  handleEventCreation() {
    this.props.history.push({
      pathname: PATHS.PUBLISH_PAPER,
      state: {
        paper: {
          title: "",
          creator: { name: this.props.loggedInUser.name },
          authors: [],
          tags: []
        },
      },
    });
  }

  handleLogout() {
    logout();
}

  render() {
    const createButton = (
      <Button
        onClick={this.handleEventCreation}
        className="primary m-2 my-lg-0"
        type="submit"
      >
        Publish Paper
      </Button>
    );
    return (
      <Navbar className="nav-effects" sticky="top" bg="light" expand="lg">
        <Navbar.Brand href={PATHS.DASHBOARD} className="nav-title">
          <img
            style={{width:"50%", height:"auto"}}
            alt="Colloquium Logo"
            src={ColloquiumLogo} 
          ></img>
        </Navbar.Brand>

        <Navbar.Collapse className="justify-content-end">
          {createButton}
          <Navbar.Text className="m-2">
            {this.props.loggedInUser.name ? this.props.loggedInUser.name : ""}
          </Navbar.Text>
          <FontAwesomeIcon
            style={{ fontSize: 35, cursor: "pointer" }}
            icon={faUserCircle}
            onClick={() =>
              this.props.history.push({
                pathname: URI_GENERATORS.USER_PROFILE(this.props.loggedInUser.id)
              })
            }
          />
          <Button style={{ marginLeft: 15}} onClick={this.handleLogout}>Logout</Button>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}

export default withRouter(AppHeader);
