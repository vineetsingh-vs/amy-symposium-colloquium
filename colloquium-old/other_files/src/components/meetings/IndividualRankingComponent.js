import { faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { authenticatedPutJson } from "../../request";
import DragDropList from "../DragDropList";
import { scrollToTop } from "../../util";

class IndividualRankingComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      myoptionRankings: [],
      hasSubmittedRankings: false,
      showConfirmModal: false
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateoptionRanks = this.updateoptionRanks.bind(this);
    this.setShowConfirmModal = this.setShowConfirmModal.bind(this);
  }

  handleSubmit() {
    authenticatedPutJson(
      "/v1/individual-ranking-meeting/individual-rank/" + this.props.meeting.id,
      { rankings: this.state.myoptionRankings }
    ).then(() => {
      this.setState({
        showConfirmModal: false,
        hasSubmittedRankings: true
      });
      this.updateMeetingRankings();
      this.props.showFeedback("Your rankings have been submitted.");
      scrollToTop();
    });
  }

  updateMeetingRankings() {
    let newRankings = [];
    if (this.props.meeting) {
      newRankings = this.props.meeting.rankings.map((pr) => {
        return {
          option_id: pr.option_id,
          option_rank: pr.option_rank,
          user_id: pr.user_id
        };
      });
    }
    let myRankings = [];
    if (this.state.myoptionRankings) {
      this.state.myoptionRankings.map((pr) => {
        return {
          option_id: pr.option_id,
          option_rank: pr.option_rank,
          user_id: this.props.loggedInUser.id
        };
      });
    }
    Array.prototype.push.apply(newRankings, myRankings);
    this.props.updateRankings(newRankings);
  }

  setShowConfirmModal(value) {
    this.setState({
      showConfirmModal: value
    });
  }

  getMyRankings() {
    if (
      this.props.meeting &&
      this.props.meeting.rankings &&
      this.props.meeting.rankings.length > 0
    ) {
      return this.props.meeting.rankings.filter(
        (ranking) => ranking.user_id === this.props.loggedInUser.id
      );
    }

    return [];
  }

  componentDidMount() {
    var mergedRanks = this.props.meeting.rankingOptions;
    var myRankings = this.getMyRankings();
    var hasRankings = myRankings && myRankings.length > 0;

    if (hasRankings) {
      mergedRanks = this.props.meeting.rankingOptions.map((item) => ({
        ...myRankings.find(
          (other) => other && other.option_id === item.option_id
        ),
        ...item
      }));
      mergedRanks.sort((a, b) => (a.option_rank > b.option_rank ? 1 : -1));
    } else {
      mergedRanks = this.props.meeting.rankingOptions.map((obj, index) => ({
        ...obj,
        option_rank: index + 1
      }));
      mergedRanks.sort((a, b) => (a.option_id > b.option_id ? 1 : -1));
    }

    this.setState({
      myoptionRankings: mergedRanks,
      hasSubmittedRankings: hasRankings
    });
  }

  updateoptionRanks(items) {
    if (items) {
      const updatedoptions = items.map((option, index) => {
        return { ...option, option_rank: index + 1 };
      });

      this.setState({
        myoptionRankings: updatedoptions
      });
    }
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
            Go back to your ranking
          </Button>
          <Button variant="primary" onClick={this.handleSubmit}>
            Proceed with submission
          </Button>
        </Modal.Footer>
      </Modal>
    );

    const submittedMessage = (
      <Form.Text className="text-success">
        Your rankings have already been submitted.
      </Form.Text>
    );

    return (
      <Form noValidate>
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
        <Form.Row className="my-5">
          <DragDropList
            items={this.state.myoptionRankings}
            update={this.updateoptionRanks}
            disabled={this.state.hasSubmittedRankings}
          />
        </Form.Row>
        <Form.Row className="mt-3 justify-content-center">
          <Button
            disabled={this.state.hasSubmittedRankings}
            onClick={() => {
              this.setShowConfirmModal(true);
            }}
            className="px-4"
          >
            Submit my rankings
          </Button>
        </Form.Row>
        <Form.Row className="mt-3 mb-5 justify-content-center">
          {this.state.hasSubmittedRankings ? submittedMessage : ""}
        </Form.Row>
      </Form>
    );
  }
}

export default IndividualRankingComponent;
