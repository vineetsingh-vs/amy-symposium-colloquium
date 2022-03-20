import {
  faAlignJustify,
  faCaretDown,
  faCaretUp,
  faCheckCircle,
  faCommentAlt,
  faEdit,
  faEllipsisV,
  faInfoCircle,
  faQuestionCircle,
  faTasks,
  faTrashAlt,
  faSort,
  faFilter,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  Button,
  ButtonGroup,
  Col,
  Container,
  Dropdown,
  Modal,
  Nav,
  NavDropdown,
  Row,
  DropdownButton,
  Form
} from "react-bootstrap";
import ReactQuill from "react-quill";
import {
  CommentSortOptions,
  CommentTypes,
  PeerReviewMeetingActions
} from "../Constants";
import "../css/DiscussionForum.css";
import { authenticatedPatchJson, authenticatedPostJson } from "../request";
import Review from "./Review.js"

class Reply extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      reviewing: false,
      reviewText: "",
      replies: this.props.review.replies,
      activeReview: null,
      // votes: this.props.review.votes
    };

    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleReviewChange = this.handleReviewChange.bind(this);
    // this.handleUpvote = this.handleUpvote.bind(this);
    // this.handleDownvote = this.handleDownvote.bind(this);
  }

  // handleUpvote(reviewID) {
  //   authenticatedPatchJson(
  //     "/v1/papers/" + this.props.paper.id + "/review/" + this.props.review.id + "/upvote",
  //     {}
  //   )
  //     .then((newVotesVal) => {
  //       this.setState({
  //         votes: newVotesVal,
  //       });
  //     })
  //     .catch((error) => { });
  // }

  // handleDownvote(reviewID) {
  //   authenticatedPatchJson(
  //     "/v1/papers/" + this.props.paper.id + "/review/" + this.props.review.id + "/downvote",
  //     {}
  //   )
  //     .then((newVotesVal) => {
  //       this.setState({
  //         votes: newVotesVal,
  //       });
  //     })
  //     .catch((error) => { });
  // }


  getEditingModeUI(review) {
    const discardModal = (
      <Modal
        show={
          this.state.showConfirmModal &&
          this.state.action === PeerReviewMeetingActions.EDIT_COMMENT
        }
        onHide={() => {
          this.setState({
            showConfirmModal: false,
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Unsaved Changes</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Comment
            <mark>
              {this.state.activeReview ? this.state.activeReview.reviewText : ""}
            </mark>{" "}
            has unsaved changes. Please save or discard your changes before
            proceeding.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() =>
              this.setState(
                {
                  showConfirmModal: false,
                },
                () => this.scrollToActiveElement()
              )
            }
          >
            Go back
          </Button>
        </Modal.Footer>
      </Modal>
    );
    return (
      <Container className="py-2">
        <Row>
          <Col>
            <ReactQuill
              theme={"snow"}
              value={
                this.state.activeReview ? this.state.activeReview.reviewText : ""
              }
              onChange={this.handleTextChange}
              placeholder={"Post something..."}
            />
          </Col>
        </Row>
        <Row className="d-flex justify-content-end px-3 my-2">
          <Button
            variant="outline-secondary"
            className="mx-2"
            onClick={() => this.setState({ activeReview: null, action: null })}
          >
            Discard Changes
          </Button>
          <Button variant="primary" onClick={this.updateReview}>
            Post
          </Button>
          {discardModal}
        </Row>
      </Container>
    );
  }

  getDisplayModeUI(review) {
    const deleteModal = (
      <Modal
        show={
          this.state.showConfirmModal &&
          this.state.action === PeerReviewMeetingActions.DELETE_COMMENT
        }
        onHide={() => {
          this.setState({
            showConfirmModal: false,
            activeReview: null,
            action: null,
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Review</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Deleted Reivews cannot be restored. Are you sure you want to delete
            the review{" "}
            <mark>
              {this.state.activeReview ? this.state.activeReview.reviewText : ""}
            </mark>
            ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              this.setState({
                showConfirmModal: false,
                activeReview: null,
                action: null,
              });
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={this.deleteReview}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    );

    return (
      <Container key={review.id} className={"py-2"} style={{}}>
        <Row>
          {/* <Col sm={1}>{this.getVotingUI()}</Col> */}
          <Col
            sm={11}
            ref="dest"
            className="justify-content-start align-items-center"
          >
            <Row>
              <Col className="m-auto d-flex justify-content-start align-items-center">
                <div
                  className="commentTextDisplay"
                  dangerouslySetInnerHTML={{
                    __html: review.reviewText,
                  }}
                />
                
              </Col>
            </Row>
            <Row className="d-flex justify-content-end align-items-center">
              <Col className="d-flex justify-content-start align-items-center">
                <small className="text-muted">{review.reviewerAlias}</small>
              </Col>
              <Col
                sm={1}
                className="d-flex justify-content-end align-items-center"
              >
                <Row className="d-flex justify-content-end align-items-center">
                  <div style={{ paddingRight: 20 + "px" }}>
                    <Button
                      onClick={() =>
                        this.setState({
                          reviewing: true,
                        })
                      }
                    >
                      Reply
                    </Button>
                  </div>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col style={{ paddingLeft: 100 + "px" }}>
            {this.state.reviewing ? (
              <Form>
                <Form.Group>
                {!(this.state.reviewing) ? (
                  <Form.Text>
                    {this.state.reviewText}
                  </Form.Text>
                ):(
                  <Form.Control
                  as="textarea"
                  rows="3"
                  onChange={this.handleReviewChange}
                  value={this.state.reviewText}
                />
                )}
              </Form.Group>
                <Form.Row>
                  <Button
                    className="mx-2"
                    onClick={this.handleCancel}
                    width="150px"
                    variant="outline-secondary"
                  >
                    Cancel
                  </Button>
                  <Button
                    className="mx-2"
                    type="submit"
                    width="150px"
                    variant="primary"
                    onClick={this.handleSubmit}
                  >
                    Post
                  </Button>
                </Form.Row>
              </Form>
            ) : (
              <div></div>
            )}
          </Col>
        </Row>
      </Container>
    );
  }

  getVotingUI() {
    return (
      <Container className="m-0 p-0 d-flex-column justify-content-center">
        <FontAwesomeIcon
          className="upVoteIcon"
          icon={faCaretUp}
          size={this.props.review.parent_id ? "lg" : "2x"}
          color="#bdb7ab"
          style={{ cursor: "pointer" }}
          // onClick={() => this.handleUpvote()}
        />
        {this.props.review.parent_id ? (
          <h5 className="m-0">{this.state.votes}</h5>
        ) : (
          <h4 className="m-0">{this.state.votes}</h4>
        )}
        <FontAwesomeIcon
          className="downVoteIcon"
          icon={faCaretDown}
          color="#bdb7ab"
          size={this.props.review.parent_id ? "lg" : "2x"}
          style={{ cursor: "pointer" }}
          // onClick={() => this.handleDownvote()}
        />
      </Container>
    );
  }

  handleSubmit(e) {
    console.log(this.props.review);
    e.preventDefault();
    const replyPayload = {
      reviewText: this.state.reviewText,
      reviewerAlias: "You",
      votes: 0,
      id: null,
      replies: [],
      parent_id: this.props.review.id,
    };
    authenticatedPostJson(
      "/v1/papers/" + this.props.paper.id + "/reviews/" + this.props.review.review_id + "/reply/", 
      replyPayload
    )
      .then((returnResponse) => {
        this.setState({
          replies: [...this.state.replies, {...replyPayload, id: returnResponse.id} ],
          editing: false,
          reviewText: null,
          reviewing: false
        });
       })
      .catch((error) => {});
  }

  handleReviewChange(e) {
    this.setState({
      reviewText: e.target.value
    });
  }

  handleCancel(e) {
    this.setState({
      reviewText: "",
      reviewing: false
    });
  }

  render() {
    return (
      <Container key={this.props.review.id}>
        <Row
          id={this.props.review.parent_id ? this.props.review.parent_id + "-" : "" + this.props.review.id}
          className="comment border-bottom"
        >       
          {this.state.activeReview &&
          this.state.activeReview.id === this.props.review.id &&
          this.state.action === PeerReviewMeetingActions.EDIT_COMMENT
            ? this.getEditingModeUI(this.props.review)
            : this.getDisplayModeUI(this.props.review)}
        </Row>
        <Row className="comment" style={{ paddingLeft: "3rem" }}>
          {(this.state.replies || this.props.review.replies) &&
            (this.state.replies || this.props.review.replies).map((reply) => {                         
              return <Reply review={reply} paper={this.props.paper}
              // upvote={this.props.upvote}
              // downvote={this.props.downvote}
              />;
            })}
        </Row>
      </Container>
    );
  }
}

export default Reply;
