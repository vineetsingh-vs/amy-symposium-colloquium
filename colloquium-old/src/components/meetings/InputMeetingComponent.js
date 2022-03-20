import React from "react";
import InputsSection from "../InputsSection";
import {
  authenticatedDeleteJson,
  authenticatedGetJson,
  authenticatedPostJson,
  authenticatedPutJson
} from "../../request";
import { GROUP_POLL_INTERVAL_MS } from "../../views/LiveMeetingPage";
import { MeetingType } from "../../Constants";
import { scrollToTop } from "../../util";

class InputMeetingComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputs: [],
      pollerId: 0
    };

    this.addInput = this.addInput.bind(this);
    this.deleteInput = this.deleteInput.bind(this);
    this.updateInput = this.updateInput.bind(this);
    this.getMeetingResponses = this.getMeetingResponses.bind(this);
  }

  addInput(newInput) {
    return authenticatedPostJson(
      "/v1/inputmeeting/" + this.props.meeting.id + "/response",
      newInput
    )
      .then((returnResponse) => {
        this.setState(
          {
            inputs: [
              {
                id: returnResponse.id,
                text: newInput.text,
                poster: this.props.loggedInUser
              },
              ...this.state.inputs
            ]
          },
          () => {
            this.props.updateMeetingInputs(this.state.inputs);
            this.props.showFeedback("Your input has been posted.");
            scrollToTop();
          }
        );
      })
      .catch((error) => {
        this.props.showFeedback("Oops, Something went wrong!");
        console.log(error);
      });
  }

  deleteInput(deletedInput) {
    return authenticatedDeleteJson(
      "/v1/inputmeeting/" +
        this.props.meeting.id +
        "/response/" +
        deletedInput.id
    )
      .then(() => {
        this.setState(
          {
            inputs: this.state.inputs.filter((r) => r.id !== deletedInput.id)
          },
          () => {
            this.props.updateMeetingInputs(this.state.inputs);
            this.props.showFeedback("The response has been deleted.");
          }
        );
      })
      .catch((error) => {
        this.props.showFeedback("Oops, Something went wrong!");
        console.log(error);
      });
  }

  updateInput(updatedInput) {
    return authenticatedPutJson(
      "/v1/inputmeeting/" +
        this.props.meeting.id +
        "/response/" +
        updatedInput.id,
      updatedInput
    )
      .then(() => {
        this.state.inputs.find((input) => input.id === updatedInput.id).text =
          updatedInput.text;

        this.props.updateMeetingInputs(this.state.inputs);
        this.props.showFeedback("Your response has been posted.");
      })
      .catch((error) => {
        this.props.showFeedback("Oops, Something went wrong!");
        console.log(error);
      });
  }

  isGroupInputMeeting() {
    return this.props.meeting.meetingType === MeetingType.GROUP_INPUT_MEETING;
  }

  componentWillUnmount() {
    clearInterval(this.state.pollerId);
  }

  componentDidMount() {
    this.getMeetingResponses();

    if (this.isGroupInputMeeting()) {
      this.setState({
        pollerId: setInterval(this.getMeetingResponses, GROUP_POLL_INTERVAL_MS)
      });
    }
  }

  getMeetingResponses() {
    if (this.props && this.props.meeting) {
      authenticatedGetJson("/v1/inputmeeting/" + this.props.meeting.id).then(
        (response) => {
          const userInputs = (this.isGroupInputMeeting()
            ? response.responses
            : response.responses.filter(
                (input) =>
                  input.poster && input.poster.id === this.props.loggedInUser.id
              )
          ).sort((a, b) => {
            return b.id - a.id;
          });

          this.setState({ inputs: userInputs });
        }
      );
    }
  }

  render() {
    return (
      <InputsSection
        inputs={this.state.inputs}
        meeting={this.props.meeting}
        addInput={this.addInput}
        deleteInput={this.deleteInput}
        updateInput={this.updateInput}
        loggedInUser={this.props.loggedInUser}
      />
    );
  }
}

export default InputMeetingComponent;
