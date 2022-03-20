import {
  faCheckCircle,
  faTimesCircle,
  faEdit,
  faUserPlus,
  faLongArrowAltLeft
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  Button,
  Col,
  Container,
  Form,
  Modal,
  Row,
  Toast
} from "react-bootstrap";
import { withRouter } from "react-router-dom";
import { PATHS } from "../AppRouter";
import AddParticipantsModal from "../components/AddParticipantsModal";
import ParticipantsTable from "../components/ParticipantsTable";
import { authenticatedPostJson, authenticatedPutJson, authenticatedGetJson } from "../request";
import { FeedbackType } from "../Constants";
import { scrollToTop } from "../util";
import Picker from "../components/Picker";
import { URI_GENERATORS } from "../AppRouter";

class PaperEditPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isNewPaper: this.props.isNewPaper,
      feedback: { show: false, message: "test", type: FeedbackType.SUCCESS },
      formIsDirty: false,
      validated: false,
      error: null,
      paper: this.props.location.state.paper,
      tags: []
    };

    this.setShowConfirmModal = this.setShowConfirmModal.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.navigate = this.navigate.bind(this);
    this.handleTitleChange = this.handleTitleChange.bind(this);
    this.handleUrlChange = this.handleUrlChange.bind(this);
    this.handleTagChange = this.handleTagChange.bind(this);
  }

  componentDidMount() {
    authenticatedGetJson("/v1/tags").then((response) => {
      this.setState({
        tags: response,
      });
    });
  }

  navigate() {
    this.props.history.push({
      pathname: PATHS.DASHBOARD,
      state: {
        eventKey: this.state.paper.id
      }
    });
  }

  setShowConfirmModal(value) {
    this.setState({
      showConfirmModal: value
    });
  }

  isEditMode() {
    return !this.state.isNewPaper;
  }

  getButtonLabel() {
    return this.isEditMode() ? "Update" : "Create";
  }

  handleSubmit(e) {
    e.preventDefault();

    if (!this.state.paper.title || this.state.paper.title === "") {
      this.setState({
        validated: false,
        error: "Must specify a title for the paper!"
      });
    } else {
      const payloadPaper = { ...this.state.paper};
      payloadPaper.authors = payloadPaper.authors.map((p) => p["id"]);

      if (this.isEditMode()) {
        authenticatedPutJson("/v1/papers/" + payloadPaper.id, payloadPaper)
          .then(() => {
            this.showFeedback(
              FeedbackType.SUCCESS,
              "Paper updated successfully."
            );
            this.props.history.push({ pathname: "/paperdashboard" });
          })
          .catch((error) => {
            console.log(error);
            this.showFeedback(FeedbackType.ERROR, "Paper update failed.");
          });
      } else {
        authenticatedPostJson("/v1/papers", payloadPaper)
          .then((returnResponse) => {
            this.setState(
              {
                paper: {
                  ...this.state.paper,
                  id: returnResponse.id,
                },

                isNewPaper: false,
              },
              () => {
                this.showFeedback(
                  FeedbackType.SUCCESS,
                  "Paper created successfully."
                );
              }
            );
            this.props.history.push({ pathname: "/paperdashboard" });
          })
          .catch((error) => {
            console.log(error);
            this.showFeedback(FeedbackType.ERROR, "Paper creation failed.");
          });
      }

      this.setState({
        formIsDirty: false,
        validated: true,
        error: null
      });
    }
  }



  handleCancel() {
    this.state.formIsDirty
      ? this.setShowConfirmModal(this.state.formIsDirty)
      : this.navigate();
  }

  handleTitleChange(e) {
    this.setState({
      paper: { ...this.state.paper, title: e.target.value },
      formIsDirty: true,
      validated: false,
      error: null
    });
  }

  handleUrlChange(e) {
    this.setState({
      paper: { ...this.state.paper, url: e.target.value },
      formIsDirty: true,
      validated: false,
      error: null
    });
  }
  handleTagChange(updatedTags) {
    this.setState({
      paper: { ...this.state.paper, tags: updatedTags},
      formIsDirty: true,
      validated: false,
      error: null
    });
  }

  showFeedback(type, message) {
    this.setState(
      {
        feedback: {
          show: true,
          message: message,
          type: type
        }
      },
      () => {
        scrollToTop();
      }
    );
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
          <Modal.Title>Confirm Navigation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Your changes have not been saved. Are you sure you want to leave this
          page?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              this.setShowConfirmModal(false);
            }}
          >
            Stay on this Page
          </Button>
          <Button variant="primary" onClick={this.navigate}>
            Leave this page
          </Button>
        </Modal.Footer>
      </Modal>
    );

    return (
      <Container>
        {confirmModal}
        <Row className="justify-content-around">
          <Col sm={9}>
            <Form
              noValidate
              validated={this.state.validated}
              onSubmit={this.handleSubmit}
            >
              <Form.Row className="mt-4 mb-0 justify-content-center">
                <Toast
                  autohide
                  delay="5000"
                  show={this.state.feedback.show}
                  onClose={() => {
                    this.setState({
                      feedback: { ...this.state.feedback, show: false }
                    });
                  }}
                >
                  <Toast.Header style={{ borderLeft: "5px" }}>
                    <FontAwesomeIcon
                      icon={
                        this.state.feedback.type === FeedbackType.SUCCESS
                          ? faCheckCircle
                          : faTimesCircle
                      }
                      style={{ fontSize: "23px" }}
                      color={
                        this.state.feedback.type === FeedbackType.SUCCESS
                          ? "green"
                          : "crimson"
                      }
                    />
                    <h6 className="m-3">{this.state.feedback.message}</h6>
                  </Toast.Header>
                </Toast>
              </Form.Row>
              <Form.Row className="border-bottom justify-content-between">
                <h3 style={{ color: "gray" }}>
                  {this.isEditMode() ? "Edit Paper" : "New Paper"}
                </h3>

                <Button onClick={this.navigate} variant="link">
                  <FontAwesomeIcon icon={faLongArrowAltLeft} />
                  &nbsp; Return to Dashboard
                </Button>
              </Form.Row>

              <Form.Group controlId="formGridName" className="mt-5">
                <Form.Label style={{ color: "gray" }}>Title</Form.Label>
                <Form.Control
                  onChange={this.handleTitleChange}
                  isInvalid={this.state.error}
                  defaultValue={this.state.paper ? this.state.paper.title : ""}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.error}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group controlId="formGridName" className="mt-5">
                <Form.Label style={{ color: "gray" }}>URL</Form.Label>
                <Form.Control
                  onChange={this.handleUrlChange}
                  isInvalid={this.state.error}
                  defaultValue={this.state.paper ? this.state.paper.url : ""}
                />
                <Form.Control.Feedback type="invalid">
                  {this.state.error}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group
                style={{ marginTop: "4rem" }}
                controlId="formGridParticipants"
              >
                <Form.Row className="justify-content-start">
                  <Form.Label style={{ color: "gray", paddingRight: "10px" }}>
                    Authors
                  </Form.Label>
                  <FontAwesomeIcon
                    className="icon-hover-blue"
                    icon={faUserPlus}
                    style={{ fontSize: "23px", cursor: "pointer"}}
                    onClick={() =>
                      this.setState({ showAddParticipantsModal: true })
                    }
                  />
                </Form.Row>

                <ParticipantsTable
                  participants={
                    this.state.paper ? this.state.paper.authors : []
                  }
                />
              </Form.Group>

                

              <AddParticipantsModal
                show={this.state.showAddParticipantsModal}
                loggedInUser={this.props.loggedInUser}
                selectedParticipants={
                  this.state.paper ? this.state.paper.authors : []
                }
                handleClose={() =>
                  this.setState({ showAddParticipantsModal: false })
                }
                handleSave={(updatedAuthors) => {
                  this.setState({
                    paper: {
                      ...this.state.paper,
                      authors: updatedAuthors
                    },
                    formIsDirty: true
                  });
                }}
              />

              <Picker
                pickables = {this.state.tags}
                selectors = {this.state.paper.tags} 
                modify = {this.handleTagChange}
              />

              <Form.Row className="border-up justify-content-end my-2 py-3">
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
                  {this.getButtonLabel()}
                </Button>
              </Form.Row>
            </Form>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default withRouter(PaperEditPage);
