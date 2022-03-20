import React from "react";
import { Container, Row, Table } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { authenticatedGetJson, authenticatedPatchJson, authenticatedPostJson } from "../request";
import { renderStars } from "./PaperDashboard";
import DiscussionForum from "../components/DiscussionForum";

class ReviewList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      paper: null,
    };

    this.handleUpvote = this.handleUpvote.bind(this);
    this.handleDownvote = this.handleDownvote.bind(this);
    this.addReply = this.addReply.bind(this);
  }

  handleUpvote(reviewID) {
    authenticatedPatchJson(
      "/v1/papers/" + this.state.paper.id + "/review/" + reviewID + "/upvote",
      {}
    )
      .then((newVotesVal) => {
        this.setState({
          paper: {
            ...this.state.paper,
            reviews: this.state.paper.reviews.map((r, i) =>
              reviewID === r.id
                ? {
                    ...r,
                    votes: newVotesVal,
                  }
                : r
            ),
          },
        });
      })
      .catch((error) => {});
  }

  handleUpvoteReply(reviewID) {
    authenticatedPatchJson(
      "/v1/papers/" + this.state.paper.id + "/review/" + reviewID + "/upvote",
      {}
    )
      .then((newVotesVal) => {
        this.setState({
          paper: {
            ...this.state.paper,
            reviews: this.state.paper.reviews.map((r, i) =>
              reviewID === r.id
                ? {
                    ...r,
                    votes: newVotesVal,
                  }
                : r
            ),
          },
        });
      })
      .catch((error) => {});
  }

  handleDownvote(reviewID) {
    authenticatedPatchJson(
      "/v1/papers/" + this.state.paper.id + "/review/" + reviewID + "/downvote",
      {}
    )
      .then((newVotesVal) => {
        this.setState({
          paper: {
            ...this.state.paper,
            reviews: this.state.paper.reviews.map((r) =>
              reviewID === r.id
                ? {
                    ...r,
                    votes: newVotesVal,
                  }
                : r
            ),
          },
        });
      })
      .catch((error) => {});
  }

  addReply(newReply, reviewID) {
    return authenticatedPostJson(
      "/v1/papers/" + this.state.paper.id + "/reviews/" + reviewID + "/reply",
      newReply
    )
      .then((returnResponse) => {
        const savedReply = { ...newReply, id: returnResponse.id };
        this.setState(
          {
            paper: {
              ...this.state.paper,
              reviews: this.state.paper.reviews.map((r, i) =>
                reviewID === r.id
                  ? {
                      ...r,
                      replies: [...r.replies, savedReply],
                    }
                  : r
              ),
            },
          }
        );

        return savedReply;
      })
      .catch((error) => {
        console.log(error);
      });
  }

  componentDidMount() {
    const paperId = this.props.match.params.paperId;
    authenticatedGetJson("/v1/papers/" + paperId).then((response) => {
      this.setState({
        paper: response,
      });
    });
  }

  renderReviewTableRow(review) {
    return (
      <tr>
        <td>{review.reviewText}</td>
        <td>{renderStars(review.rating)}</td>
        <td>{review.reviewerAlias}</td>
      </tr>
    );
  }

  render() {
    return this.state.paper ? (
      <Container className="m-5">
        <Row className="border-bottom" style={{ marginBottom: "3rem" }}>
          <h3>Reviews for {this.state.paper.title}</h3>
        </Row>
        <DiscussionForum
          comments={this.state.paper.reviews.map((r) => {
            return {
              reviewText: r.reviewText,
              reviewerAlias: r.reviewerAlias,
              votes: r.votes,
              id: r.id,
              replies: r.replies,
            };
          })}
          upvote={this.handleUpvote}
          downvote={this.handleDownvote}
          upvoteReply={this.handleUpvoteReply}
          downvoteReply={this.handleDownvoteReply}
          history={this.props.history}
          paper={this.state.paper}
          addReply={this.addReply}
        />
      </Container>
    ) : null;
  }
}

export default withRouter(ReviewList);
