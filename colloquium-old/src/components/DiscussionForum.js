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
import { authenticatedPatchJson } from "../request";
import Review from "./Review";
import { URI_GENERATORS } from "../AppRouter";

class DiscussionForum extends React.Component {
  constructor(props) {
    super(props);

    this.handleTextChange = this.handleTextChange.bind(this);
    this.handleMenuSelect = this.handleMenuSelect.bind(this);
    this.deleteComment = this.deleteComment.bind(this);
    this.updateComment = this.updateComment.bind(this);
    this.changeCommentType = this.changeCommentType.bind(this);
    this.addComment = this.addComment.bind(this);
    this.changeSortHandler = this.changeSortHandler.bind(this);

    this.state = {
      comments: props.comments,
      action: null,
      showConfirmModal: false,
      type: "",
      activeComment: null,
      sortOption: CommentSortOptions.OLDEST_TO_NEWEST,
      filterOption: "All" /* show all */,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.comments !== this.props.comments) {
      // filter
      const filteredComments =
        this.state.filterOption === "All"
          ? nextProps.comments
          : nextProps.comments.filter(
              (c) => c.responseType === this.state.filterOption
            );

      // sort
      const comments = [];
      let parentToCommentMap = new Map();

      filteredComments.map((r) => {
        if (r && r.parentId) {
          if (!parentToCommentMap.has(r.parentId)) {
            parentToCommentMap.set(r.parentId, []);
          }
          parentToCommentMap.get(r.parentId).push(r);
        } else {
          comments.push(r);
        }

        return r;
      });

      const sortedComments = comments
        ? comments
            .map((c) => {
              c.replies = parentToCommentMap.has(c.id)
                ? parentToCommentMap.get(c.id).sort((a, b) => {
                    return this.compareComments(this.state.sortOption, a, b);
                  })
                : [];

              return c;
            })
            .sort((a, b) => {
              return this.compareComments(this.state.sortOption, a, b);
            })
        : [];

      this.setState({
        comments: sortedComments,
      });
    }
  }

  changeSortHandler(e) {
    this.setState({
      sortOption: e,
    });
    // sort
    let sortedComments = this.state.comments;
    sortedComments.sort((a, b) => {
      return this.compareComments(e, a, b);
    });
    console.log(sortedComments);

    this.setState(
      {
        comments: sortedComments,
      });
    }

  compareComments(sortType, a, b) {
    if (!sortType && sortType === CommentSortOptions.OLDEST_TO_NEWEST) {
      return a.id - b.id;
    } else if (sortType === CommentSortOptions.NEWEST_TO_OLDEST) {
      return b.id - a.id;
    } else if (sortType === CommentSortOptions.MOST_VOTES) {
      return b.votes - a.votes;
    } else if (sortType === CommentSortOptions.LEAST_VOTES) {
      return a.votes - b.votes;
    }
    return a.id - b.id;
  }

  handleTextChange(content) {
    this.setState({
      activeComment: {
        ...this.state.activeComment,
        text: content,
        isDirty: true,
      },
    });
  }

  handleMenuSelect(eventKey, comment) {
    if (
      comment &&
      this.state.activeComment &&
      comment.id !== this.state.activeComment.id &&
      this.state.activeComment.isDirty &&
      this.state.action === PeerReviewMeetingActions.EDIT_COMMENT
    ) {
      this.setState({
        showConfirmModal: true,
      });
    } else if (eventKey === PeerReviewMeetingActions.ADD_COMMENT) {
      this.addComment(comment);
    } else if (eventKey === PeerReviewMeetingActions.REPLY_TO_COMMENT) {
      this.addComment({
        text: "",
        voteCount: 0,
        parentId: comment.id,
        responseType: CommentTypes.FEEDBACK,
      });
    } else if (eventKey === PeerReviewMeetingActions.EDIT_COMMENT) {
      /* Edit */
      this.setState({
        activeComment: { ...comment },
        action: PeerReviewMeetingActions.EDIT_COMMENT,
      });
    } else if (eventKey === PeerReviewMeetingActions.DELETE_COMMENT) {
      /* Delete */

      this.setState({
        activeComment: comment,
        showConfirmModal: true,
        action: PeerReviewMeetingActions.DELETE_COMMENT,
      });
    }
  }

  addComment(comment) {
    this.props.addComment(comment).then((savedComment) => {
      this.setState(
        {
          activeComment: { ...savedComment },
          action: PeerReviewMeetingActions.EDIT_COMMENT,
        },
        () => this.scrollToActiveElement()
      );
    });
  }

  deleteComment() {
    this.props.deleteComment(this.state.activeComment).then(() => {
      this.setState({
        activeComment: null,
        showConfirmModal: false,
        action: null,
      });
    });
  }

  updateComment() {
    if (this.state.activeComment) {
      this.props.updateComment(this.state.activeComment).then(() => {
        this.setState({
          activeComment: null,
          action: null,
        });
      });
    }
  }

  changeCommentType(eventKey, comment) {
    this.setState(
      {
        activeComment: { ...comment, responseType: eventKey },
        action: PeerReviewMeetingActions.CHANGE_COMMENT_TYPE,
      },
      () => this.updateComment()
    );
  }

  isLoggedInUserInput(comment) {
    return (
      comment &&
      comment.poster &&
      comment.poster.id === this.props.loggedInUser.id
    );
  }

  getCommentTypeUI(comment) {
    return (
      <Dropdown as={ButtonGroup} id="comment-type-dropdown" size="sm">
        <Button variant="success" size="sm">
          <FontAwesomeIcon
            icon={this.getCommentTypeIcon(
              comment && comment.responseType
                ? comment.responseType
                : CommentTypes.FEEDBACK
            )}
          />
          &emsp;
          {comment && comment.responseType
            ? comment.responseType
            : CommentTypes.FEEDBACK}
        </Button>
      </Dropdown>
    );
  }

  getCommentTypeIcon(type) {
    switch (type) {
      case CommentTypes.QUESTION:
        return faQuestionCircle;
      case CommentTypes.UNRESOLVED_TASK:
        return faTasks;
      case CommentTypes.RESOLVED_TASK:
        return faCheckCircle;
      case CommentTypes.SUMMARY:
        return faAlignJustify;
      case CommentTypes.FEEDBACK:
      default:
        return faInfoCircle;
    }
  }

  getNewCommentUI() {
    return (
      <Button
        variant={"outline-primary"}
        className="my-3"
        size="lg"
        onClick={() =>
          this.props.history.push({
            pathname: URI_GENERATORS.REVIEW_PAPER(this.props.paper.id),
          })
        }
      >
        Add a review
      </Button>
    );
  }

  scrollToActiveElement() {
    var domElement = document.getElementById(
      this.state.activeComment.parentId
        ? this.state.activeComment.parentId + "-"
        : "" + this.state.activeComment.id
    );

    if (domElement) {
      domElement.scrollIntoView();
    }
  }

  getEmptyStateUI() {
    return this.state.filterOption !== "All" ? (
      <Container>
        <Row>
          <Col className="d-flex justify-content-center">
            <FontAwesomeIcon icon={faSearch} size="4x" color="lightgray" />
          </Col>
        </Row>
        <Row>
          <Col>
            <h5 className="text-center">No matching results found.</h5>
          </Col>
        </Row>
      </Container>
    ) : (
      <h5 className="text-center">No comments posted yet!</h5>
    );
  }

  render() {
    return (
      <Container>
        <Row className="py-2">
          <Col sm={1} className="d-flex justify-content-end">
            <DropdownButton
              title={<FontAwesomeIcon icon={faSort} />}
              key={"comment-sort"}
              variant={"outline-secondary"}
            >
              {Object.values(CommentSortOptions).map((option) => (
                <Dropdown.Item
                  key={option}
                  eventKey={option}
                  active={option === this.state.sortOption}
                  onSelect={(e) =>{
                    this.setState({sortOption:e})
                    this.changeSortHandler(e)
                    }
                  }
                >
                  {option}
                </Dropdown.Item>
              ))}
            </DropdownButton>

            <DropdownButton
              className="pl-3"
              title={<FontAwesomeIcon icon={faFilter} />}
              key={"comment-filter"}
              variant={"outline-secondary"}
            >
              <Dropdown.Item
                eventKey="All"
                active={this.state.filterOption === "All"}
                onSelect={(e) =>
                  this.setState({
                    filterOption: e,
                  })
                }
              >
                All
              </Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Header>Comment Types</Dropdown.Header>
              {Object.values(CommentTypes).map((type) => (
                <Dropdown.Item
                  eventKey={type}
                  active={type === this.state.filterOption}
                  onSelect={(e) =>
                    this.setState({
                      filterOption: e,
                    })
                  }
                >
                  {type}
                </Dropdown.Item>
              ))}
            </DropdownButton>
          </Col>
        </Row>
        <Row>
          {this.state.comments && this.state.comments.length > 0
            ? this.state.comments.map((comment) => <Review review={comment} paper = {this.props.paper}
            upvote={this.props.upvote}
            downvote={this.props.downvote}/>)
            : this.getEmptyStateUI()}
        </Row>
        <Row className="d-flex justify-content-center">
          {this.getNewCommentUI()}
        </Row>
      </Container>
    );
  }
}

export default DiscussionForum;
