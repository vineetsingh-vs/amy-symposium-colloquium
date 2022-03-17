import React from "react";
import { withRouter } from "react-router-dom";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { authenticatedGetJson, authenticatedPostJson } from "../request";
import { URI_GENERATORS } from "../AppRouter";

class ReviewPaper extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      validated: false,
      paper: null,
      reviewText: "",
      rating: 1,
    };

    this.handleReviewChange = this.handleReviewChange.bind(this);
    this.handleRatingChange = this.handleRatingChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const paperId = this.props.match.params.paperId;
    authenticatedGetJson("/v1/papers/" + paperId).then((response) => {
      this.setState({
        paper: response,
      });
    });
  }

  handleReviewChange(e) {
    this.setState({
      formIsDirty: true,
      validated: false,
      error: null,
      reviewText: e.target.value,
    });
  }

  handleRatingChange(e) {
    this.setState({
      formIsDirty: true,
      validated: false,
      error: null,
      rating: e.target.value,
    });
  }

  handleCancel(e) {
    // this.props.history.push({pathname: URI_GENERATORS.REVIEW_LIST(this.state.paper.id)})
    this.props.history.goBack();
  }

  handleSubmit(e) {
    e.preventDefault();

    if (this.state.reviewText === "") {
      this.setState({
        validated: false,
        error: "Must include some text in review!",
      });
    } else {
      const reviewPayload = {
        reviewText: this.state.reviewText,
        rating: this.state.rating,
      };
      authenticatedPostJson(
        "/v1/papers/" + this.state.paper.id + "/review",
        reviewPayload
      )
        .then((returnResponse) => { 
          this.props.history.push({pathname: URI_GENERATORS.REVIEW_LIST(this.state.paper.id)})
        })
        .catch((error) => { });

      this.setState({
        formIsDirty: false,
        validated: true,
        error: null,
      });
    }
  }

  render() {
    return (
      <Container>
        <Row className="justify-content-around">
          <Col sm={9}>
            <Form
              noValidate
              validated={this.state.validated}
              onSubmit={this.handleSubmit}
            >
              <Form.Row className="mt-4 mb-0 justify-content-center">
                <h3 style={{ color: "gray" }}>
                  {this.state.paper
                    ? "Review \"" + this.state.paper.title + '"'
                    : null}
                </h3>
              </Form.Row>

              <Form.Group controlId="formGridName" className="mt-5">
                <Form.Label style={{ color: "gray" }}>
                  Write your thoughts on the paper
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows="5"
                  onChange={this.handleReviewChange}
                  isInvalid={this.state.error}
                  defaultValue={this.state.reviewText}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.error}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group>
                <Form.Label style={{ color: "gray" }}>
                  Choose an overall rating out of 5
                </Form.Label>
                <Form.Control
                  as="select"
                  onChange={this.handleRatingChange}
                  defaultValue={this.state.rating}
                >
                  {[...Array(5).keys()].map((i) => (
                    <option key={i}>{i + 1}</option>
                  ))}
                </Form.Control>
              </Form.Group>
              <Form.Row className="border-up justify-content-end bg-light my-2 py-3">
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
                >
                  Submit Review
                </Button>
              </Form.Row>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(ReviewPaper);
