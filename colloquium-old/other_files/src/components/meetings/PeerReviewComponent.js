import React from "react";
import DiscussionForum from "../DiscussionForum";
import {
  authenticatedDeleteJson,
  authenticatedGetJson,
  authenticatedPostJson,
  authenticatedPutJson
} from "../../request";
import { GROUP_POLL_INTERVAL_MS } from "../../views/LiveMeetingPage";
import { MeetingType } from "../../Constants";
import { scrollToTop } from "../../util";

class PeerReviewComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      comments: [],
      pollerId: 0
    };

    this.addComment = this.addComment.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.getMeetingResponses = this.getMeetingResponses.bind(this);
  }

  addComment(newComment) {
    return authenticatedPostJson(
      "/v1/inputmeeting/" + this.props.meeting.id + "/response",
      newComment
    )
      .then((returnResponse) => {
        const savedComment = { ...newComment, id: returnResponse.id };
        this.setState(
          {
            comments: [...this.state.comments, savedComment]
          },
          () => {
            this.props.updateMeetingInputs(this.state.comments);
            this.props.showFeedback("Your comment has been posted.");
          }
        );

        return savedComment;
      })
      .catch((error) => {
        this.props.showFeedback("Oops, Something went wrong!");
        console.log(error);
      });
  }

  deleteComment(deletedComment) {
    return authenticatedDeleteJson(
      "/v1/inputmeeting/" +
        this.props.meeting.id +
        "/response/" +
        deletedComment.id
    )
      .then(() => {
        this.setState(
          {
            comments: this.state.comments.filter(
              (c) => c.id !== deletedComment.id
            )
          },
          () => {
            this.props.updateMeetingInputs(this.state.comments);
            this.props.showFeedback("Your comment has been deleted.");
          }
        );
      })
      .catch((error) => {
        this.props.showFeedback("Oops, Something went wrong!");
        console.log(error);
      });
  }

  updateComment(updatedComment) {
    return authenticatedPutJson(
      "/v1/inputmeeting/" +
        this.props.meeting.id +
        "/response/" +
        updatedComment.id,
      updatedComment
    )
      .then((response) => {
        const comment = this.state.comments.find((c) => c.id === response.id);

        comment.text = response.text;
        comment.responseType = response.responseType;
        comment.voteCount = response.voteCount;

        this.props.updateMeetingInputs(this.state.comments);
        this.props.showFeedback("Your comment has been posted.");
      })
      .catch((error) => {
        this.props.showFeedback("Oops, Something went wrong!");
        console.log(error);
      });
  }

  componentWillUnmount() {
    clearInterval(this.state.pollerId);
  }

  componentDidMount() {
    this.getMeetingResponses();

    this.setState({
      pollerId: setInterval(this.getMeetingResponses, GROUP_POLL_INTERVAL_MS)
    });
  }

  getMeetingResponses() {
    if (this.props && this.props.meeting) {
      authenticatedGetJson("/v1/inputmeeting/" + this.props.meeting.id).then(
        (response) => {
          this.setState({
            comments: response.responses
          });
        }
      );
    }
  }

  render() {
    return (
      <DiscussionForum
        comments={this.state.comments}
        meeting={this.props.meeting}
        addComment={this.addComment}
        deleteComment={this.deleteComment}
        updateComment={this.updateComment}
        loggedInUser={this.props.loggedInUser}
      />
    );
  }
}

export default PeerReviewComponent;
