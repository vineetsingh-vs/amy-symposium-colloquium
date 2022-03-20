import React from "react";
import { Button, Modal, Form, Col, Table } from "react-bootstrap";
import { MeetingStatus, MeetingType } from "../Constants";
import ToggleSwitch from "./ToggleSwitch";

export default class AddMeetingModal extends React.Component {
  constructor(props) {
    super(props);

    this.meetingTypeDropdownList = [
      MeetingType.ATTENDANCE,
      MeetingType.INDIVIDUAL_RANKING,
      MeetingType.GROUP_RANKING,
      MeetingType.INDIVIDUAL_INPUT_MEETING,
      MeetingType.GROUP_INPUT_MEETING,
      MeetingType.PEER_REVIEW_MEETING
    ];

    this.state = {
      name: "",
      passcode: "",
      rankingOptions: [],
      meetingType: "",
      newRankingOption: "",
      status: MeetingStatus.SCHEDULED,
      meetingTypeIndex: -1,
      dependsOnOtherMeeting: false,

      /* Input Meeting fields */
      inputPrompt: "",
      inputShowUserNames: false,
      inputAllowMultipleResponses: true,
      inputAllowEditingAllResponses: false
    };

    this.handleSave = this.handleSave.bind(this);
    this.getFormForMeetingType = this.getFormForMeetingType.bind(this);
  }

  handleSave() {
    if (this.state.meetingType === MeetingType.ATTENDANCE) {
      this.props.handleSave({
        meetingType: this.state.meetingType,
        name: this.state.name,
        status: this.state.status,
        passcode: this.state.passcode
      });
    } else if (
      this.state.meetingType === MeetingType.INDIVIDUAL_INPUT_MEETING ||
      this.state.meetingType === MeetingType.GROUP_INPUT_MEETING ||
      this.state.meetingType === MeetingType.PEER_REVIEW_MEETING
    ) {
      this.props.handleSave({
        meetingType: this.state.meetingType,
        name: this.state.name,
        status: this.state.status,
        prompt: this.state.inputPrompt,
        allowMultipleResponses: this.state.inputAllowMultipleResponses,
        showUserNames: this.state.inputShowUserNames,
        allowEditingAllResponses: this.state.inputAllowEditingAllResponses
      });
    } else {
      this.props.handleSave({
        meetingType: this.state.meetingType,
        name: this.state.name,
        status: this.state.status,
        rankingOptions: this.state.dependsOnOtherMeeting
          ? []
          : this.state.rankingOptions,
        fetchRelative: this.state.dependsOnOtherMeeting
      });
    }
    this.setState({
      name: "",
      passcode: "",
      meetingType: "",
      newRankingOption: "",
      rankingOptions: [],
      meetingTypeIndex: -1,
      inputAllowEditingAllResponses: false,
      inputAllowMultipleResponses: false,
      inputShowUserNames: false,
      inputPrompt: ""
    });
    this.props.handleClose();
  }

  getInputMeetingForm() {
    return (
      <div>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={(e) => this.setState({ name: e.target.value })}
              placeholder="Enter the meeting name"
              defaultValue={this.state.name}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Prompt</Form.Label>
            <Form.Control
              onChange={(e) => this.setState({ inputPrompt: e.target.value })}
              placeholder="Enter a prompt message (optional)"
              defaultValue={this.state.inputPrompt}
            />
          </Form.Group>
        </Form.Row>
        {this.state.meetingType === MeetingType.PEER_REVIEW_MEETING ? (
          ""
        ) : (
          <Form.Row className="pt-3 pb-2 align-items-center">
            <Col>
              <Form.Label>
                Allow participants to post multiple responses
              </Form.Label>
            </Col>

            <Col sm={2} className="justify-content-end">
              <ToggleSwitch
                uniqueKey="allowMultipleResponsesSwitch"
                checked={this.state.inputAllowMultipleResponses}
                onChange={() => {
                  this.setState({
                    inputAllowMultipleResponses: !this.state
                      .inputAllowMultipleResponses
                  });
                }}
              />
            </Col>
          </Form.Row>
        )}
        {this.state.meetingType === MeetingType.GROUP_INPUT_MEETING ||
        this.state.meetingType === MeetingType.PEER_REVIEW_MEETING ? (
          <div>
            <Form.Row className="pb-2 align-items-center">
              <Col>
                <Form.Label>
                  Allow participants to edit all responses
                </Form.Label>
              </Col>
              <Col sm={2} className="justify-content-end">
                <ToggleSwitch
                  uniqueKey="allowEditResponsesSwitch"
                  checked={this.state.inputAllowEditingAllResponses}
                  onChange={() => {
                    this.setState({
                      inputAllowEditingAllResponses: !this.state
                        .inputAllowEditingAllResponses
                    });
                  }}
                />
              </Col>
            </Form.Row>
            <Form.Row className="pb-2 align-items-center">
              <Col>
                <Form.Label>Show participant names in posts</Form.Label>
              </Col>
              <Col sm={2} className="justify-content-end">
                <ToggleSwitch
                  uniqueKey="showUserNamesSwitch"
                  checked={this.state.inputShowUserNames}
                  onChange={() => {
                    this.setState({
                      inputShowUserNames: !this.state.inputShowUserNames
                    });
                  }}
                />
              </Col>
            </Form.Row>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }

  getRankingMeetingForm() {
    return (
      <div>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={(e) => this.setState({ name: e.target.value })}
              placeholder="Enter the meeting name"
              defaultValue={this.state.name}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row className="py-3">
          <Col>
            <Form.Label>Use prior meeting results as options</Form.Label>
          </Col>
          <Col sm={2} className="justify-content-end">
            <ToggleSwitch
              uniqueKey="inputFromOtherMeeting"
              checked={this.state.dependsOnOtherMeeting}
              onChange={() => {
                this.setState({
                  dependsOnOtherMeeting: !this.state.dependsOnOtherMeeting
                });
              }}
            />
          </Col>
        </Form.Row>
        {this.state.dependsOnOtherMeeting ? null : (
          <Form.Row>
            <Form.Group as={Col}>
              <Table responsive="sm" hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Option</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.rankingOptions.map((option, i) => {
                    return (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{option}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
              <Form.Control
                onChange={(e) =>
                  this.setState({ newRankingOption: e.target.value })
                }
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    this.setState({
                      rankingOptions: [
                        ...this.state.rankingOptions,
                        this.state.newRankingOption
                      ],
                      newRankingOption: ""
                    });
                  }
                }}
                placeholder="Enter ranking option"
                value={this.state.newRankingOption}
              />
            </Form.Group>
          </Form.Row>
        )}
      </div>
    );
  }

  getAttendanceMeetingForm() {
    return (
      <div>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Name</Form.Label>
            <Form.Control
              onChange={(e) => this.setState({ name: e.target.value })}
              placeholder="Enter the meeting name"
              defaultValue={this.state.name}
            />
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group as={Col}>
            <Form.Label>Passcode</Form.Label>
            <Form.Control
              onChange={(e) => this.setState({ passcode: e.target.value })}
              placeholder="Specify the passcode that attendees will submit"
              defaultValue={this.state.passcode}
            />
          </Form.Group>
        </Form.Row>
      </div>
    );
  }

  getFormForMeetingType() {
    if (this.state.meetingType === MeetingType.ATTENDANCE) {
      return this.getAttendanceMeetingForm();
    } else if (
      this.state.meetingType === MeetingType.INDIVIDUAL_INPUT_MEETING ||
      this.state.meetingType === MeetingType.GROUP_INPUT_MEETING ||
      this.state.meetingType === MeetingType.PEER_REVIEW_MEETING
    ) {
      return this.getInputMeetingForm();
    } else if (
      this.state.meetingType === MeetingType.INDIVIDUAL_RANKING ||
      this.state.meetingType === MeetingType.GROUP_RANKING
    ) {
      return this.getRankingMeetingForm();
    }
  }

  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{this.props.Title} New Meeting</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            className="m-3"
            noValidate
            validated={this.state.responsePosted}
          >
            <Form.Row>
              <Form.Group as={Col}>
                <Form.Label>Meeting Type</Form.Label>
                <Form.Control
                  value={this.state.meetingTypeIndex}
                  onChange={(e) => {
                    this.setState({
                      meetingTypeIndex: e.target.value,
                      meetingType: this.meetingTypeDropdownList[e.target.value]
                    });
                  }}
                  as="select"
                >
                  <option disabled value={-1} key={-1}>
                    Select meeting type
                  </option>
                  {this.meetingTypeDropdownList.map((name, i) => (
                    <option value={i} key={i}>
                      {name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form.Row>
            {this.getFormForMeetingType(
              this.state.meetingTypeIndex,
              this.meetingTypeDropdownList
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.handleSave}>
            Add Meeting to Event
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
