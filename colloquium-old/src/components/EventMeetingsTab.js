import React from "react";
import { Button, Modal, Container, Table, Form } from "react-bootstrap";
import { PATHS } from "../AppRouter";
import { withRouter } from "react-router-dom";
import { authenticatedPutJson, authenticatedPatchJson } from "../request";
import AttendanceResultsTable from "./AttendanceResultsTable";
import IndividualRankingResultsTable from "./IndividualRankingResultsTable";
import GroupRankingResultsTable from "./GroupRankingResultsTable";
import InputMeetingResultsTable from "./InputMeetingResultsTable";
import { MeetingType, MeetingStatus } from "../Constants";

const MeetingTypeToPatchUriMap = new Map([
  [MeetingType.INDIVIDUAL_RANKING, "/v1/individual-ranking-meeting/"],
  [MeetingType.GROUP_RANKING, "/v1/group-ranking-meeting/"]
]);

class EventMeetingsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
      showMeetingResults: this.props.event.meetings.map((m) => false),
      showStartMeetingModal: this.props.event.meetings.map((m) => false),
      meetingForInputIndex: -1
    };

    this.setShowMeetingResults = this.setShowMeetingResults.bind(this);
  }

  startMeeting(meeting) {
    let newMeeting = { ...meeting };
    newMeeting.status = MeetingStatus.IN_PROGRESS;

    this.props.updateMeeting(this.props.event, newMeeting);
    // if the admin is also a participant in the meeting, redirect to live meeting page.
    authenticatedPutJson(
      this.getAPIpaths(newMeeting.meetingType) + newMeeting.id,
      newMeeting
    ).then(() => {
      if (this.isEventParticipant()) {
        this.joinMeeting(newMeeting);
      }
    });
  }

  joinMeeting(meeting) {
    this.props.history.push({
      pathname:
        PATHS.LIVE_MEETING +
        "/" +
        this.props.event.id +
        "/meeting/" +
        meeting.id,
      state: {
        meeting: meeting,
        event: this.props.event,
        loggedInUser: this.props.loggedInUser
      }
    });
  }

  endMeeting(meeting) {
    let newMeeting = { ...meeting };
    newMeeting.status = MeetingStatus.COMPLETED;

    this.props.updateMeeting(this.props.event, newMeeting);
    authenticatedPutJson(
      this.getAPIpaths(newMeeting.meetingType) + newMeeting.id,
      newMeeting
    );
  }

  getAPIpaths(meetingType) {
    switch (meetingType) {
      case MeetingType.ATTENDANCE:
        return "/v1/attendancemeetings/";
      case MeetingType.INDIVIDUAL_RANKING:
        return "/v1/individual-ranking-meeting/";
      case MeetingType.GROUP_RANKING:
        return "/v1/group-ranking-meeting/";
      case MeetingType.PEER_REVIEW_MEETING:
      case MeetingType.INDIVIDUAL_INPUT_MEETING:
      case MeetingType.GROUP_INPUT_MEETING:
        return "/v1/inputmeeting/";
      default:
        return "";
    }
  }

  getIndexOfNextMeetingToStart(meetings) {
    if (meetings.length && meetings[0].status === MeetingStatus.SCHEDULED) {
      return 0;
    } else if (meetings.length) {
      const eligibleNextMeetingIndices = [...Array(meetings.length - 1).keys()]
        .map((index) => index + 1)
        .filter(
          (index) =>
            meetings[index - 1].status === MeetingStatus.COMPLETED &&
            meetings[index].status === MeetingStatus.SCHEDULED
        );
      return eligibleNextMeetingIndices.length
        ? eligibleNextMeetingIndices[0]
        : -1;
    } else {
      return -1;
    }
  }

  isEventParticipant() {
    if (
      this.props.event &&
      this.props.event.participants &&
      this.props.loggedInUser
    ) {
      let obj = this.props.event.participants.find(
        (p) => p.id === this.props.loggedInUser.id
      );

      return obj;
    }

    return false;
  }

  userIsHost() {
    return this.props.loggedInUser.id === this.props.event.creator.id;
  }

  setShowMeetingResults(index, show) {
    let newArr = [...this.state.showMeetingResults];
    newArr[index] = show;
    this.setState({ showMeetingResults: newArr });
  }

  setShowStartMeetingModal(index, show) {
    let newArr = [...this.state.showStartMeetingModal];
    newArr[index] = show;
    this.setState({ showStartMeetingModal: newArr });
  }

  mergeArraysById(a1, a2) {
    // Guarantees all the participants will be in the records, and in same order
    return a1.map((item) => ({
      ...a2.find((other) => other && other.id === item.id),
      ...item
    }));
  }

  getMeetingResultsRows(meeting) {
    if (
      !meeting.meetingType ||
      meeting.meetingType === MeetingType.ATTENDANCE
    ) {
      return this.getAttendanceMeetingResultsRows(meeting);
    }

    if (meeting.meetingType === MeetingType.INDIVIDUAL_RANKING) {
      return this.getIndividualRankingMeetingResultsRows(meeting);
    }

    if (meeting.meetingType === MeetingType.GROUP_RANKING) {
      return this.getGroupRankingMeetingResultsRows(meeting);
    }
    if (
      meeting.meetingType === MeetingType.INDIVIDUAL_INPUT_MEETING ||
      meeting.meetingType === MeetingType.GROUP_INPUT_MEETING
    ) {
      return this.getInputMeetingResultsRows(meeting);
    }
  }

  getInputMeetingResultsRows(meeting) {
    const resultsArray = this.props.event ? meeting.responses : [];
    return resultsArray.map((idea, index) => ({
      index: index + 1,
      idea: idea.text,
      name: idea.poster.name
    }));
  }

  getAttendanceMeetingResultsRows(meeting) {
    const mergedArray = this.props.event
      ? this.mergeArraysById(this.props.event.participants, meeting.record)
      : [];
    return mergedArray.map((user, index) => ({
      index: index + 1,
      header: user.name,
      attendance: ["attend" in user ? user.attend : false]
    }));
  }

  getIndividualRankingMeetingResultsRows(meeting) {
    // TODO: Sort by user's ranking?
    const concastatedArray = meeting.rankings
      .map((dict) => dict.option_id)
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((i) => {
        return { option_id: i };
      });
    const stats = this.getStats(meeting.rankings);
    return concastatedArray
      .sort((a, b) => a.option_id - b.option_id)
      .map((option) => ({
        option_id: option.option_id,
        stats: stats[option.option_id]
      }));
  }

  getGroupRankingMeetingResultsRows(meeting) {
    const concastatedArray = meeting.rankings
      .sort((a, b) => a.option_rank - b.option_rank)
      .map((dict) => dict.option_id)
      .map((i) => {
        return { option_id: i };
      });
    return concastatedArray.map((option, index) => ({
      option_rank: index + 1,
      option_id: option.option_id
    }));
  }

  getStats(rankings) {
    var stats = {};
    rankings.forEach((element) => {
      if (stats[element.option_id] === undefined) {
        stats[element.option_id] = [];
      }
      stats[element.option_id].push([
        element.option_rank,
        element.user_id === this.props.loggedInUser.id
      ]);
    });
    return stats;
  }

  getAttendanceCount(meeting) {
    const mergedArray =
      this.props.event && meeting
        ? this.mergeArraysById(this.props.event.participants, meeting.record)
        : [];

    return mergedArray.reduce((count, user) => {
      return count + ("attend" in user && user.attend ? 1 : 0);
    }, 0);
  }

  resultDisplay(meeting) {
    if (
      !meeting.meetingType ||
      meeting.meetingType === MeetingType.ATTENDANCE
    ) {
      return this.attendanceResultDisplay(meeting);
    }

    if (meeting.meetingType === MeetingType.INDIVIDUAL_RANKING) {
      return this.individualRankingResultsDisplay(meeting);
    }

    if (meeting.meetingType === MeetingType.GROUP_RANKING) {
      return this.groupRankingResultsDisplay(meeting);
    }

    if (
      meeting.meetingType === MeetingType.INDIVIDUAL_INPUT_MEETING ||
      meeting.meetingType === MeetingType.GROUP_INPUT_MEETING
    ) {
      return this.inputMeetingResultsDisplay(meeting);
    }
  }

  attendanceResultDisplay(meeting) {
    return (
      <div>
        <h5>
          {"Attendance Count: " +
            this.getAttendanceCount(meeting) +
            "/" +
            this.mergeArraysById(this.props.event.participants, meeting.record)
              .length}
        </h5>
        <AttendanceResultsTable
          headers={["#", "Participant", "Attended?"]}
          rows={this.getMeetingResultsRows(meeting)}
          freezeRowHeader={false}
        />
      </div>
    );
  }

  individualRankingResultsDisplay(meeting) {
    return (
      <div>
        <IndividualRankingResultsTable
          headers={["option Name", "Stats"]}
          rows={this.getMeetingResultsRows(meeting)}
          freezeRowHeader={false}
          meeting={meeting}
        />
      </div>
    );
  }

  inputMeetingResultsDisplay(meeting) {
    return (
      <div>
        <InputMeetingResultsTable
          headers={["#", "Input", "Submitted By"]}
          rows={this.getMeetingResultsRows(meeting)}
          freezeRowHeader={false}
          meeting={meeting}
        />
      </div>
    );
  }

  groupRankingResultsDisplay(meeting) {
    return (
      <div>
        <GroupRankingResultsTable
          headers={["Rank", "option Name"]}
          rows={this.getMeetingResultsRows(meeting)}
          freezeRowHeader={false}
          meeting={meeting}
        />
      </div>
    );
  }

  getMeetingRows() {
    const indexOfNextMeetingToStart = this.getIndexOfNextMeetingToStart(
      this.props.event.meetings
    );
    return this.props.event.meetings.map((meeting, index) => {
      let startButton = "";

      if (this.userIsHost() && meeting.status === MeetingStatus.SCHEDULED) {
        startButton = (
          <Button
            key={MeetingStatus.SCHEDULED}
            size="sm"
            className="mr-1"
            variant="success"
            disabled={index !== indexOfNextMeetingToStart}
            onClick={() =>
              meeting.fetchRelative === true
                ? this.setShowStartMeetingModal(index, true)
                : this.startMeeting(meeting)
            }
          >
            Start Meeting
          </Button>
        );
      }

      let joinButton = "";
      if (
        meeting.status === MeetingStatus.IN_PROGRESS &&
        this.isEventParticipant()
      ) {
        joinButton = (
          <Button
            key={MeetingStatus.IN_PROGRESS}
            size="sm"
            className="mr-1"
            variant="success"
            onClick={() => this.joinMeeting(meeting)}
          >
            Join
          </Button>
        );
      }

      let endButton = "";
      if (meeting.status === MeetingStatus.IN_PROGRESS && this.userIsHost()) {
        endButton = (
          <Button
            key={MeetingStatus.COMPLETED}
            size="sm"
            variant="outline-danger"
            onClick={() => this.endMeeting(meeting)}
          >
            End Meeting
          </Button>
        );
      }

      let viewButton = "";
      if (meeting.status === MeetingStatus.COMPLETED) {
        viewButton = (
          <Button
            onClick={() => {
              this.setShowMeetingResults(index, true);
            }}
            key="View Results"
            size="sm"
            variant="outline-secondary"
          >
            View Results
          </Button>
        );
      }

      let actionButtons = [startButton, joinButton, endButton, viewButton];

      return (
        <tr key={meeting.id} className="text-center">
          <td>{meeting.name}</td>
          <td>{meeting.meetingType}</td>
          <td>{meeting.status}</td>
          <td>{actionButtons}</td>
          <Modal
            size="lg"
            show={this.state.showMeetingResults[index]}
            onHide={() => {
              this.setShowMeetingResults(index, false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>{meeting.name + " Results"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {meeting ? this.resultDisplay(meeting) : <h5>No Results</h5>}
            </Modal.Body>
          </Modal>
          <Modal
            show={this.state.showStartMeetingModal[index]}
            onHide={() => {
              this.setShowStartMeetingModal(index, false);
              this.setState({ meetingForInputIndex: -1 });
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>{"Select input for " + meeting.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form.Group>
                <Form.Control
                  value={this.state.meetingForInputIndex}
                  onChange={(e) => {
                    this.setState({
                      meetingForInputIndex: e.target.value
                    });
                  }}
                  as="select"
                >
                  <option disabled value={-1} key={-1}>
                    Select meeting result for input
                  </option>
                  {this.props.event.meetings.map((m, i) => {
                    return m.id !== meeting.id &&
                      m.status === MeetingStatus.COMPLETED &&
                      [
                        MeetingType.INDIVIDUAL_INPUT_MEETING,
                        MeetingType.GROUP_INPUT_MEETING
                      ].includes(m.meetingType) ? (
                      <option value={i} key={i}>
                        {m.name}
                      </option>
                    ) : null;
                  })}
                </Form.Control>
              </Form.Group>
              {this.state.meetingForInputIndex !== -1 ? (
                <Table responsive="sm" hover>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Option</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.props.event.meetings[
                      this.state.meetingForInputIndex
                    ].responses.map((response, i) => {
                      // TODO more generic handling of conversion from result to next input
                      return (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td>{response.text}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
              ) : null}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="primary"
                onClick={() => {
                  const meetingForInput = this.props.event.meetings[
                    this.state.meetingForInputIndex
                  ];
                  const options = meetingForInput.responses.map(
                    (response) => response.text
                  );
                  authenticatedPatchJson(
                    MeetingTypeToPatchUriMap.get(meeting.meetingType) +
                      meeting.id,
                    {
                      rankingOptions: options,
                      pointsToMeeting: meetingForInput.id
                    }
                  ).then((updatedMeeting) => {
                    this.startMeeting(updatedMeeting);
                    this.setShowStartMeetingModal(index, false);
                  });
                }}
              >
                Start Meeting
              </Button>
            </Modal.Footer>
          </Modal>
        </tr>
      );
    });
  }

  render() {
    return (
      <Container style={{ marginTop: "2rem" }}>
        <Table responsive="sm" hover>
          <thead>
            <tr className="text-center">
              <th>Name</th>
              <th>Type</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>{this.getMeetingRows()}</tbody>
        </Table>
      </Container>
    );
  }
}

export default withRouter(EventMeetingsTab);
