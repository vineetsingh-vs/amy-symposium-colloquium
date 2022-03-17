import { faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Badge, Breadcrumb, Col, Container, Row, Toast } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { PATHS } from "../AppRouter";
import AttendanceComponent from "../components/meetings/AttendanceComponent";
import GroupRankingComponent from "../components/meetings/GroupRankingComponent";
import IndividualRankingComponent from "../components/meetings/IndividualRankingComponent";
import InputMeetingComponent from "../components/meetings/InputMeetingComponent";
import { authenticatedGetJson } from "../request";
import { MeetingStatus, MeetingType } from "../Constants";
import PeerReviewComponent from "../components/meetings/PeerReviewComponent";

export const GROUP_POLL_INTERVAL_MS = 1200;

class LiveMeetingPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      event: null,
      meeting: null,
      loggedInUser: null,
      feedbackMessage: "You have joined the meeting!",
      showFeedback: true
    };

    this.navigate = this.navigate.bind(this);
    this.showFeedbackMessage = this.showFeedbackMessage.bind(this);
    this.updateMeetingRankings = this.updateMeetingRankings.bind(this);
    this.updateMeetingInputs = this.updateMeetingInputs.bind(this);
  }

  componentDidMount() {
    if (this.props.location.state && this.props.location.state.meeting) {
      this.setState({
        meeting: this.props.location.state.meeting
      });
      if (this.props.location.state && this.props.location.state.event) {
        this.setState({
          event: this.props.location.state.event
        });
      }
    } else {
      this.queryMeeting();
    }
    if (this.props.location.state && this.props.location.state.loggedInUser) {
      this.setState({
        loggedInUser: this.props.location.state.loggedInUser
      });
    } else {
      this.setState({
        loggedInUser: this.props.loggedInUser
      });
    }
  }

  queryMeeting() {
    authenticatedGetJson("/v1/events/" + this.props.match.params.eventID).then(
      (response) => {
        let meetingID = this.props.match.params.meetingID;
        this.setState({
          event: response,
          meeting: response.meetings.find(
            (x) => x.id.toString() === meetingID.toString()
          )
        });
      }
    );
  }

  navigate() {
    this.props.history.push({
      pathname: PATHS.DASHBOARD,
      state: {
        eventKey: this.state.event ? this.state.event.id : "",
        tabKey: "meetings"
      }
    });
  }

  showFeedbackMessage(message) {
    this.setState({
      showFeedback: true,
      feedbackMessage: message
    });
  }

  getStatusBadge() {
    let variant = "light";
    let status = this.state.meeting ? this.state.meeting.status : "";
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

  updateMeetingRankings(newRankings) {
    this.setState({
      meeting: { ...this.state.meeting, rankings: newRankings }
    });
  }

  updateMeetingInputs(newInputs) {
    this.setState({
      meeting: { ...this.state.meeting, responses: newInputs }
    });
  }

  renderMeetingComponent(meetingType) {
    switch (meetingType) {
      case MeetingType.ATTENDANCE:
        return (
          <AttendanceComponent
            event={this.state.event}
            meeting={this.state.meeting}
            loggedInUser={this.state.loggedInUser}
            showFeedback={this.showFeedbackMessage}
          />
        );
      case MeetingType.INDIVIDUAL_RANKING:
        return (
          <IndividualRankingComponent
            event={this.state.event}
            meeting={this.state.meeting}
            itemsTitle="Projects"
            showFeedback={this.showFeedbackMessage}
            loggedInUser={this.state.loggedInUser}
            updateRankings={this.updateMeetingRankings}
          />
        );
      case MeetingType.GROUP_RANKING:
        return (
          <GroupRankingComponent
            event={this.state.event}
            meeting={this.state.meeting}
            itemsTitle="Projects"
            showFeedback={this.showFeedbackMessage}
            loggedInUser={this.state.loggedInUser}
            updateRankings={this.updateMeetingRankings}
          ></GroupRankingComponent>
        );
      case MeetingType.GROUP_INPUT_MEETING:
      case MeetingType.INDIVIDUAL_INPUT_MEETING:
        return (
          <InputMeetingComponent
            event={this.state.event}
            meeting={this.state.meeting}
            showFeedback={this.showFeedbackMessage}
            loggedInUser={this.state.loggedInUser}
            updateMeetingInputs={this.updateMeetingInputs}
          ></InputMeetingComponent>
        );
      case MeetingType.PEER_REVIEW_MEETING:
        return (
          <PeerReviewComponent
            event={this.state.event}
            meeting={this.state.meeting}
            showFeedback={this.showFeedbackMessage}
            loggedInUser={this.state.loggedInUser}
            updateMeetingInputs={this.updateMeetingInputs}
          ></PeerReviewComponent>
        );

      default:
        return <h3>Not a valid meeting type.</h3>;
    }
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-around">
          <Col sm={9}>
            <Row className="justify-content-around mt-4 mb-0">
              <Col sm={7}>
                <Toast
                  autohide
                  delay="5000"
                  show={
                    this.state.showFeedback &&
                    (this.state.meeting
                      ? this.state.meeting.status === MeetingStatus.IN_PROGRESS
                      : false)
                  }
                  onClose={() => {
                    this.setState({ showFeedback: false });
                  }}
                >
                  <Toast.Header style={{ borderLeft: "5px" }}>
                    <FontAwesomeIcon
                      icon={faCheckCircle}
                      style={{ fontSize: "23px" }}
                      color="green"
                    />
                    <h6 className="m-3">{this.state.feedbackMessage}</h6>
                  </Toast.Header>
                </Toast>
              </Col>
            </Row>
            <Row>
              <Col className="px-0">
                <Breadcrumb>
                  <Breadcrumb.Item onClick={this.navigate}>
                    {this.state.event ? this.state.event.name : "Event"}
                  </Breadcrumb.Item>

                  <Breadcrumb.Item active>
                    {this.state.meeting ? this.state.meeting.name : "Meeting"}
                  </Breadcrumb.Item>
                </Breadcrumb>
              </Col>
            </Row>
            <Row className="justify-content-between pb-2 border-bottom">
              <h3>{this.state.meeting ? this.state.meeting.name : ""}</h3>
              {this.getStatusBadge()}
            </Row>

            <Row className="justify-content-center">
              <Col>
                {this.renderMeetingComponent(
                  this.state.meeting ? this.state.meeting.meetingType : ""
                )}
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(LiveMeetingPage);
