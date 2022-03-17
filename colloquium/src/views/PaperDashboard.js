import React from "react";
import {
  faExternalLinkAlt,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faStar as faStarHollow } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container, Row, Table, Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { authenticatedGetJson } from "../request";
import { URI_GENERATORS } from "../AppRouter";
import Picker from "../components/Picker";

const NUM_STARS = 5;

class PaperDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      papers: [],
      tags: [],
      userTags: [],
    };

    this.navigateToReview = this.navigateToReview.bind(this);
    this.navigateToReviewList = this.navigateToReviewList.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
  }

  handleTagChange(updatedTags) {
    this.setState({
      userTags: updatedTags,
      formIsDirty: true,
      validated: false,
      error: null
    });
  }


  componentDidMount() {
    authenticatedGetJson("/v1/papers").then((response) => {
      this.setState({
        papers: response,
      });
    });
    authenticatedGetJson("/v1/tags").then((response) => {
      this.setState({
        tags: response,
      });
    });
  }

  renderRatingCell(paper) {
    const reviews = paper.reviews;
    if (reviews && reviews.length) {
      const ratingAvg =
        reviews.map((r) => r.rating).reduce((x, y) => x + y, 0) /
        reviews.length;
      return (
        <div>
          {renderStars(ratingAvg)}
          <a href="" onClick={() => this.navigateToReviewList(paper.id)}>
            {reviews.length + (reviews.length === 1 ? " review" : " reviews")}
          </a>
        </div>
      );
    } else {
      return "No reviews yet";
    }
  }

  renderAuthorName(author) {
    return (
      <div>
        <a href="" onClick={() => this.navigateToUserProfile(author.id)}>
          {author.name}
        </a>
        <br />
      </div>
    );
  }

  navigateToReview(paperId) {
    this.props.history.push({
      pathname: URI_GENERATORS.REVIEW_PAPER(paperId),
    });
  }

  navigateToReviewList(paperId) {
    this.props.history.push({
      pathname: URI_GENERATORS.REVIEW_LIST(paperId),
    });
  }

  navigateToUserProfile(userId) {
    this.props.history.push({
      pathname: URI_GENERATORS.USER_PROFILE(userId),
    });
  }

  makeValidHttpUrl(string) {
    let url;
    
    try {
      url = new URL(string);
      return string;
    } catch (_) {
      return "https://" + string;
    }
  }

  renderPaperTableRow(paper) {
    return (
      <tr>
        <td>{paper.title}</td>
        <td>{paper.authors.map((a) => this.renderAuthorName(a))}</td>
        <td>
          <a target="_blank" rel="noopener noreferrer" href={this.makeValidHttpUrl(paper.url)}>
            <FontAwesomeIcon icon={faExternalLinkAlt} />
          </a>
        </td>
        <td>{this.renderRatingCell(paper)}</td>
        <td>
          <Button
            className="primary m-2 my-lg-0"
            onClick={() => this.navigateToReview(paper.id)}
          >
            Review
          </Button>
        </td>
      </tr>
    );
  }

  render() {
    return (
      <Container className="m-5">
        <Row className="border-bottom" style={{ marginBottom: "3rem" }}>
          <h3>Papers</h3>
        </Row>
        <Row>

        <Picker
                pickables = {this.state.tags}
                selectors = {this.state.userTags} 
                modify = {this.handleTagChange}
              />

        </Row>
        <Row>
          <Table hover>
            <thead>
              <tr>
                <th>Name</th>
                <th>Author(s)</th>
                <th>Link</th>
                <th>Rating</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {this.state.papers.filter(
                p => !this.state.userTags.length || this.state.userTags.some(userTag => p.tags.map(t => t.id).includes(userTag))
              ).map((p) => this.renderPaperTableRow(p))}
            </tbody>
          </Table>
        </Row>
      </Container>
    );
  }
}

export function renderStars(rating) {
  return <div>
    <div title={rating + " stars"}>
      {[...Array(NUM_STARS).keys()].map((index) => {
        if (rating >= index + 1) {
          return <FontAwesomeIcon icon={faStar} />;
        } else if (rating > index) {
          return <FontAwesomeIcon icon={faStarHalfAlt} />;
        } else {
          return <FontAwesomeIcon icon={faStarHollow} />;
        }
      })}
    </div>
  </div>;
}

export default withRouter(PaperDashboard);
