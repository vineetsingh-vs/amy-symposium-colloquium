import { faArchive, faEdit } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { PATHS } from "../AppRouter";

class EventContent extends React.Component {
  constructor(props) {
    super(props);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleReport = this.handleReport.bind(this);
  }

  handleEdit(event) {
    event.preventDefault();

    this.props.history.push({
      pathname: PATHS.EDIT_EVENT,
      state: {
        event: this.props.event
      }
    });
  }

  handleReport(event) {
    event.preventDefault();

    this.props.history.push({
      pathname: PATHS.EVENT_REPORT,
      state: {
        event: this.props.event
      }
    });
  }

  userIsHost() {
    return this.props.loggedInUser.id === this.props.event.creator.id;
  }

  render() {
    return (
      <Container>
        {this.userIsHost() ? (
          <Row className="justify-content-end">
            <Button variant="outline-secondary mx-3" onClick={this.handleEdit}>
              <FontAwesomeIcon icon={faEdit} />
              &nbsp;Edit
            </Button>
          </Row>
        ) : (
          ""
        )}

        <Row>
          <Col sm={12}>{this.props.children}</Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(EventContent);
