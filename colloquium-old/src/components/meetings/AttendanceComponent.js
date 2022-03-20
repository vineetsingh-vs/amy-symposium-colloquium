import { faKey } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Badge, Button, Form, InputGroup } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { PATHS } from "../../AppRouter";
import { MeetingStatus } from "../../Constants";
import { authenticatedPostJson } from "../../request";

class AttendanceComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      canSumit: this.canUserAttend(this.props.loggedInUser, this.props.meeting),
      passcode: "",
      validated: false,
      showJoinMessage: true,
      meeting: null
    };

    this.handlePasscodeChange = this.handlePasscodeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.navigate = this.navigate.bind(this);
  }

  navigate() {
    this.props.history.push({
      pathname: PATHS.DASHBOARD,
      state: {
        eventKey: this.state.event.id,
        tabKey: "meetings"
      }
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.passcode === this.props.meeting.passcode) {
      this.setState({
        canSubmit: true,
        validated: true,
        error: null
      });

      authenticatedPostJson(
        "/v1/attendancemeetings/" + this.props.meeting.id + "/attendancerecord",
        { passcode: this.state.passcode }
      );
    } else {
      this.setState({
        canSubmit: false,
        validated: false,
        error: "Please provide the correct attendance passcode."
      });
    }
  }

  handlePasscodeChange(e) {
    this.setState({
      passcode: e.target.value,
      validated: false,
      error: null
    });
  }

  getStatusBadge() {
    let variant = "light";
    let status = this.props.meeting ? this.props.meeting.status : "";
    switch (status) {
      case MeetingStatus.IN_PROGRESS:
        variant = "success";
        break;
      case MeetingStatus.COMPLETED:
        variant = "danger";
        break;
      default:
        variant = "light";
    }

    return (
      <Badge className="my-2" variant={variant}>
        {status}
      </Badge>
    );
  }

  canUserAttend(user, meeting) {
    if (meeting && user && meeting.status === MeetingStatus.IN_PROGRESS) {
      const record = meeting.record.find((item) => item.id === user.id);
      return !(record && record.attend);
    }

    return false;
  }

  render() {
    return (
      <Form noValidate validated={this.state.validated}>
        <Form.Row className="my-5 justify-content-between">
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faKey} />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              placeholder="Enter the meeting passcode"
              isInvalid={this.state.error}
              onChange={this.handlePasscodeChange}
              value={this.state.passcode}
            />
            <Form.Control.Feedback type="invalid">
              {this.state.error}
            </Form.Control.Feedback>
          </InputGroup>
        </Form.Row>
        <Form.Row>
          <Button
            disabled={this.state.canSubmit}
            onClick={this.handleSubmit}
            type="submit"
          >
            I'm here!
          </Button>
        </Form.Row>
      </Form>
    );
  }
}

export default withRouter(AttendanceComponent);
