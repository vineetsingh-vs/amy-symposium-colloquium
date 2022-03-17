import React from "react";
import { withRouter } from "react-router-dom";
import { Container, Row, Form, Button } from "react-bootstrap";
import { authenticatedGetJson, authenticatedPatchJson } from "../request";
import { HorizontalBar } from "react-chartjs-2";
import Picker from "../components/Picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
} from "@fortawesome/free-solid-svg-icons";

class UserProfile extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      user: {},
      papers: [],
      editing: false,
      bioEditText: "",
      tags: [],
      tagEditList: [],
    };

    this.handleBioChange = this.handleBioChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount() {
    const userId = this.props.match.params.userId;
    authenticatedGetJson("/v1/users/" + userId).then((response) => {
      this.setState({
        user: response,
        bioEditText: response.bio,
        tagEditList: response.tags.map((tag) => tag.id),
      });
    });
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

  handleSubmit(e) {
    e.preventDefault();
    const profilePayload = {
      bio: this.state.bioEditText,
      tags: this.state.tagEditList,
    };
    authenticatedPatchJson(
      "/v1/users/" + this.state.user.id + "/update_profile",
      profilePayload
    )
      .then((returnResponse) => {
        this.setState({
          user: {
            ...this.state.user,
            bio: this.state.bioEditText,
            tags: this.state.tagEditList.map((id) => {
              return {
                id: id,
                name: this.state.tags
                  .filter((tag) => tag.id == id)
                  .map((tag) => tag.name)[0],
              };
            }),
          },
          editing: false,
        });
      })
      .catch((error) => {});
  }

  handleCancel(e) {
    this.setState({
      bioEditText: this.state.user.bio,
      tagEditList: this.state.user.tags.map((tag) => tag.id),
      editing: false,
    });
  }

  handleBioChange(e) {
    this.setState({
      bioEditText: e.target.value,
    });
  }

  handleTagChange = (tagEditList) => {
    this.setState({
      tagEditList: tagEditList,
    });
  };

  calcAvg(listOfInt) {
    return (
      Math.round(
        (10 * listOfInt.reduce((x, y) => x + y, 0)) / listOfInt.length
      ) / 10
    );
  }

  renderEditProfile() {
    return (
      <Container className="m-5">
        <Row className="border-bottom">
          <h3>{this.state.user ? this.state.user.name : "" + "'s Profile"}</h3>
        </Row>
        <Row>
          <Form>
            <Form.Group controlId="formGridName" className="mt-5">
              <Form.Label style={{ color: "gray" }}>Email</Form.Label>
              <Form.Text>
                {this.state.user ? this.state.user.emailId : ""}
              </Form.Text>
              <Form.Label style={{ color: "gray", marginTop: "15px"}}>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows="5"
                onChange={this.handleBioChange}
                value={this.state.bioEditText}
              />
            </Form.Group>
            <Form.Label style={{ color: "gray" }}>Interests</Form.Label>
            <Picker
              pickables={this.state.tags}
              selectors={this.state.tagEditList}
              modify={this.handleTagChange}
              readOnly={false}
            />
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
              Save
            </Button>
          </Form>
        </Row>
      </Container>
    );
  }

  renderReadProfile() {
    return (
      <Container className="m-5">
        <Row className="border-bottom" style={{display: "flex", alignItems: "center" }}>
          <h3>{this.state.user ? this.state.user.name : "" + "'s Profile"}</h3>
          <FontAwesomeIcon
            className="icon-hover-blue"
            icon={faEdit}
            style={{margin: "15px", fontSize: "20px", cursor: "pointer" }}
            onClick={() =>
              this.setState({
                editing: true,
              })
            }
          />
        </Row>
        <Row>
          <Form>
            <Form.Group controlId="formGridName" className="mt-5">
              <Form.Label style={{ color: "gray" }}>Email</Form.Label>
              <Form.Text>
                {this.state.user ? this.state.user.emailId : ""}
              </Form.Text>
              <Form.Label style={{ color: "gray", marginTop: "18px"}}>Bio</Form.Label>
              <Form.Text>{this.state.bioEditText}</Form.Text>
            </Form.Group>
            <Form.Label style={{ color: "gray" }}>Interests</Form.Label>
            <Form.Row>
              <Picker
                pickables={this.state.tags}
                selectors={this.state.tagEditList}
                modify={this.handleTagChange}
                readOnly={true}
              />
            </Form.Row>
          </Form>
        </Row>
      </Container>
    );
  }

  render() {
    const papersPublished =
      this.state.papers && this.state.user
        ? this.state.papers.filter((p) =>
            p.authors.map((a) => a.id).includes(this.state.user.id)
          )
        : null;

    const authorIdToPaperCount = this.state.papers.reduce((dict, p) => {
      p.authors
        .map((a) => a.id)
        .reduce((dict, authorId) => {
          dict[authorId] = dict[authorId] + 1 || 1;
          return dict;
        }, dict);
      return dict;
    }, {});

    return this.state.editing &&
      this.state.user.id == this.props.loggedInUser.id
      ? this.renderEditProfile()
      : this.renderReadProfile();
  }
}

export default withRouter(UserProfile);
