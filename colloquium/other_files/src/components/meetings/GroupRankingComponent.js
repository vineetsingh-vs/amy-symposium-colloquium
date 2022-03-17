import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Form, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  authenticatedGetJson,
  authenticatedPostJson,
  authenticatedPutJson
} from "../../request";
import DragDropList from "../DragDropList";
import { scrollToTop } from "../../util";
import { GROUP_POLL_INTERVAL_MS } from "../../Constants";

class GroupRankingComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasApproved: false,
      hasSubmittedRankings: false,
      approveError: "",
      approvalsCount: 0,
      minimumRequiredApprovals: 0,
      optionRankings: this.props.meeting.rankings,
      validated: false,
      pollerId: 0,
      showConfirmModal: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleApprovalChange = this.handleApprovalChange.bind(this);
    this.updateoptionRanks = this.updateoptionRanks.bind(this);
    this.setShowConfirmModal = this.setShowConfirmModal.bind(this);
    this.prepareForSubmit = this.prepareForSubmit.bind(this);
    this.getTeamRankings = this.getTeamRankings.bind(this);
    this.refreshRankings = this.refreshRankings.bind(this);
  }

  handleApprovalChange(event) {
    let newValue = event.target.checked;

    authenticatedPutJson(
      "/v1/group-ranking-meeting/group-rank/" + this.props.meeting.id,
      { approval: newValue }
    ).then(() => {
      this.setState({
        hasApproved: newValue,
        validated: false
      });
    });
  }

  prepareForSubmit() {
    const canSubmit =
      this.state.approvalsCount >= this.state.minimumRequiredApprovals;
    this.setState({
      validated: true,
      showConfirmModal: canSubmit,
      approveError: canSubmit
        ? ""
        : "You need " +
          this.state.minimumRequiredApprovals +
          " approvals from your group to submit rankings."
    });
  }

  handleSubmit() {
    authenticatedPostJson(
      "/v1/group-ranking-meeting/group-rank/" + this.props.meeting.id
    ).then(() => {
      this.setState({
        showConfirmModal: false,
        hasSubmittedRankings: true
      });
      this.props.updateRankings(
        this.state.optionRankings.map((pr) => {
          return { option_id: pr.option_id, option_rank: pr.option_rank };
        })
      );
      this.props.showFeedback("Your rankings have been submitted.");
      scrollToTop();
    });
  }

  updateoptionRanks(items) {
    if (items) {
      const updatedoptions = items.map((option, index) => {
        return { ...option, option_rank: index + 1 };
      });

      authenticatedPutJson(
        "/v1/group-ranking-meeting/group-rank/" + this.props.meeting.id,
        { rankings: updatedoptions }
      ).then(() => {
        this.setState({
          optionRankings: updatedoptions,
          hasApproved: false,
          validated: false
        });
      });
    }
  }

  componentWillUnmount() {
    clearInterval(this.state.pollerId);
  }

  componentDidMount() {
    this.getTeamRankings();
    this.setState({
      pollerId: setInterval(this.refreshRankings, GROUP_POLL_INTERVAL_MS)
    });
  }

  refreshRankings() {
    if (this.props && this.props.meeting) {
      authenticatedGetJson(
        "/v1/group-ranking-meeting/group-rank/" + this.props.meeting.id
      ).then((groupRankResponse) => {
        if (groupRankResponse) {
          let count = 0;
          let approved = false;

          const teamApprovals = groupRankResponse.approval;
          if (teamApprovals && Object.keys(teamApprovals).length > 0) {
            Object.keys(teamApprovals).forEach((key) => {
              count += teamApprovals[key] ? 1 : 0;
            });
          }
          approved =
            teamApprovals.hasOwnProperty(this.props.loggedInUser.id) &&
            teamApprovals[this.props.loggedInUser.id];

          const teamRankings =
            groupRankResponse.rankings && groupRankResponse.rankings.length > 0
              ? groupRankResponse.rankings
              : this.state.optionRankings;

          this.setState({
            hasApproved: approved,
            approvalsCount: count,
            optionRankings: teamRankings,
            hasSubmittedRankings: groupRankResponse.submission_status
          });
        }
      });
    }
  }

  getTeamRankings() {
    if (this.props) {
      if (this.props.event && this.props.event.participants) {
        this.setState({
          minimumRequiredApprovals: Math.ceil(
            this.props.event.participants.length / 2
          )
        });
      }

      if (this.props.meeting) {
        var mergedRanks = this.props.meeting.rankingOptions;
        var hasRankings =
          this.props.meeting &&
          this.props.meeting.rankings &&
          this.props.meeting.rankings.length > 0;

        if (hasRankings) {
          mergedRanks = this.props.meeting.rankingOptions.map((item) => ({
            ...this.props.meeting.rankings.find(
              (other) => other && other.proj_id === item.proj_id
            ),
            ...item
          }));
          mergedRanks.sort((a, b) => (a.option_rank > b.option_rank ? 1 : -1));
        } else {
          // retain order in which options were created
          mergedRanks.sort((a, b) => (a.option_id > b.option_id ? 1 : -1));
          mergedRanks = this.props.meeting.rankingOptions.map((obj, index) => ({
            ...obj,
            option_rank: index + 1
          }));
        }

        this.setState({
          hasSubmittedRankings: hasRankings,
          optionRankings: mergedRanks
        });
      }
    }
  }

  setShowConfirmModal(value) {
    this.setState({
      showConfirmModal: value
    });
  }

  render() {
    const confirmModal = (
      <Modal
        show={this.state.showConfirmModal}
        onHide={() => {
          this.setShowConfirmModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Submission</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          You cannot edit your rankings once submitted. Are you sure you want to
          submit?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              this.setShowConfirmModal(false);
            }}
          >
            Go back to group ranking
          </Button>
          <Button variant="primary" onClick={this.handleSubmit}>
            Proceed with submission
          </Button>
        </Modal.Footer>
      </Modal>
    );

    const submittedMessage = (
      <Form.Text className="text-success">
        Your group rankings have already been submitted.
      </Form.Text>
    );

    return (
      <Form noValidate validated={this.state.validated}>
        {confirmModal}
        <Form.Row className="mt-5 justify-content-center">
          <h5>{this.props.itemsTitle}</h5>
        </Form.Row>
        <Form.Row className="mb-3 align-items-center justify-content-center">
          <FontAwesomeIcon icon={faInfoCircle} color="gray"></FontAwesomeIcon>
          <p className="px-2 mb-0 text-muted">
            Drag and drop to order {this.props.itemsTitle.toLowerCase()} from
            most-desirable to least-desirable.
          </p>
        </Form.Row>
        <Form.Row>
          <DragDropList
            items={this.state.optionRankings}
            update={this.updateoptionRanks}
            disabled={this.state.hasSubmittedRankings}
          />
        </Form.Row>
        <Form.Row className="mt-2 justify-content-center align-items-center">
          <Form.Check
            required
            feedback="You must approve before submitting."
            label="I approve our rankings!"
            key="approveCheckbox"
            onChange={this.handleApprovalChange}
            checked={this.state.hasApproved}
            disabled={this.state.hasSubmittedRankings}
          />
          <OverlayTrigger
            key="right"
            placement="right"
            trigger="hover"
            overlay={
              <Tooltip id="approveHelp">
                Your approvals are reset when your rankings change.
              </Tooltip>
            }
          >
            <FontAwesomeIcon
              className="ml-2"
              icon={faQuestionCircle}
              color="blue"
              size="xs"
            />
          </OverlayTrigger>
        </Form.Row>
        <Form.Row className="mt-1 mb-5 justify-content-center align-items-center">
          <Form.Text className="text-muted">
            Approval Votes: {this.state.approvalsCount}/
            {this.props.event && this.props.event.participants
              ? this.props.event.participants.length
              : 0}
          </Form.Text>

          <OverlayTrigger
            key="right"
            placement="right"
            trigger="hover"
            overlay={
              <Tooltip id="approveHelp">
                You need atleast{" "}
                <strong>{this.state.minimumRequiredApprovals}</strong> votes to
                submit your rankings.
              </Tooltip>
            }
          >
            <FontAwesomeIcon
              className="ml-2"
              icon={faQuestionCircle}
              color="blue"
              size="xs"
            />
          </OverlayTrigger>
          <Form.Control.Feedback className="text-center d-block" type="invalid">
            {this.state.approveError}
          </Form.Control.Feedback>
        </Form.Row>
        <Form.Row className="mt-1 justify-content-center">
          <Button
            disabled={this.state.hasSubmittedRankings}
            onClick={this.prepareForSubmit}
            className="px-4"
          >
            Submit my group's rankings
          </Button>
        </Form.Row>
        <Form.Row className="mt-3 mb-5 justify-content-center">
          {this.state.hasSubmittedRankings ? submittedMessage : ""}
        </Form.Row>
      </Form>
    );
  }
}

export default GroupRankingComponent;
