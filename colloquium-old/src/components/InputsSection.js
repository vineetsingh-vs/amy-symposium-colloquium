import { faEdit, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import {
  faInfoCircle,
  faSortAmountDown
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Form,
  FormControl,
  InputGroup,
  ListGroup,
  Modal,
  OverlayTrigger,
  Row,
  Tooltip
} from "react-bootstrap";
import "../css/InputsSection.css";

class InputsSection extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      newInputText: "",
      hoveredInputIndex: -1,
      hoveredInput: null,
      toggleToEditMode: false,
      showDeleteModal: false,
      canPostInput: this.canUserPostInput()
    };

    this.deleteHoveredInput = this.deleteHoveredInput.bind(this);
    this.addInput = this.addInput.bind(this);
    this.updateHoveredInput = this.updateHoveredInput.bind(this);
  }

  addInput(e) {
    e.preventDefault();

    const newInput = { text: this.state.newInputText };
    this.props.addInput(newInput).then(() => {
      this.setState({
        canPostInput: this.canUserPostInput(),
        newInputText: ""
      });
    });
  }

  deleteHoveredInput() {
    this.props.deleteInput(this.state.hoveredInput).then(() => {
      this.setState({
        canPostInput: this.canUserPostInput(),
        hoveredInput: null,
        showDeleteModal: false
      });
    });
  }

  canUserPostInput() {
    if (!this.props.meeting.allowMultipleResponses) {
      const userInputs = this.props.inputs.filter(
        (input) =>
          input.poster && input.poster.id === this.props.loggedInUser.id
      );

      return userInputs.length === 0;
    }

    return this.props.meeting.allowMultipleResponses;
  }

  updateHoveredInput() {
    if (this.state.hoveredInput && this.state.toggleToEditMode) {
      this.props.updateInput(this.state.hoveredInput).then(() => {
        this.setState({
          hoveredInput: null,
          toggleToEditMode: false
        });
      });
    }
  }

  getPostInputForm() {
    return (
      <Form noValidate className="py-3">
        {this.props.meeting.prompt && this.props.meeting.prompt.length > 0 ? (
          <Form.Row>
            <Form.Label className="lead text-secondary">
              {this.props.meeting.prompt}
            </Form.Label>
          </Form.Row>
        ) : (
          ""
        )}

        <Form.Row>
          <Col>
            <Form.Group>
              <Form.Control
                size="lg"
                type="text"
                value={this.state.newInputText}
                placeholder="Post something..."
                disabled={!this.state.canPostInput}
                onChange={(e) => {
                  this.setState({
                    newInputText: e.target.value
                  });
                }}
              />
              {!this.props.meeting.allowMultipleResponses ? (
                <Form.Text className="text-muted">
                  <FontAwesomeIcon className="ml-2" icon={faInfoCircle} /> You
                  can only post one input for this meeting!
                </Form.Text>
              ) : (
                ""
              )}
            </Form.Group>
          </Col>
          <Col sm={1}>
            <Button
              size="lg"
              type="submit"
              onClick={this.addInput}
              disabled={
                (this.state.newInputText &&
                  this.state.newInputText.length === 0) ||
                !this.state.canPostInput
              }
            >
              Post
            </Button>
          </Col>
        </Form.Row>
      </Form>
    );
  }

  isLoggedInUserInput(input) {
    return (
      input && input.poster && input.poster.id === this.props.loggedInUser.id
    );
  }

  canUserEditInput(input) {
    return (
      this.props.meeting.allowEditingAllResponses ||
      this.isLoggedInUserInput(input)
    );
  }

  getReadOnlyInput(input) {
    const deleteModal = (
      <Modal
        show={this.state.showDeleteModal}
        onHide={() => {
          this.setState({
            showDeleteModal: false,
            hoveredInput: null
          });
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete Input</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Deleted inputs cannot be restored. Are you sure you want to delete
            the input{" "}
            <mark>
              {this.state.hoveredInput ? this.state.hoveredInput.text : ""}
            </mark>
            ?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              this.setState({
                showDeleteModal: false,
                hoveredInput: null
              });
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={this.deleteHoveredInput}>
            Delete Input
          </Button>
        </Modal.Footer>
      </Modal>
    );

    return (
      <Row>
        <Col>
          <p className="mb-0">{input.text}</p>
          {this.props.meeting.showUserNames ? (
            <small className="text-muted">
              {this.isLoggedInUserInput(input) ? "You" : input.poster.name}
            </small>
          ) : (
            ""
          )}
        </Col>
        <Col sm={2} className="d-flex align-content-center justify-content-end">
          {this.getEditInputButtons(input)}
        </Col>
        {deleteModal}
      </Row>
    );
  }

  getEditableInput(input) {
    return (
      <Row className="my-3">
        <Col sm={9}>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text>
                <FontAwesomeIcon icon={faEdit} />
              </InputGroup.Text>
            </InputGroup.Prepend>
            <FormControl
              value={
                this.state.hoveredInput ? this.state.hoveredInput.text : ""
              }
              aria-label="input text"
              aria-describedby="basic-addon1"
              onChange={(e) =>
                this.setState({
                  hoveredInput: {
                    ...this.state.hoveredInput,
                    text: e.target.value
                  }
                })
              }
            />
          </InputGroup>
        </Col>
        <Col sm={1} className="p-0">
          <Button type="submit" onClick={this.updateHoveredInput}>
            Save
          </Button>
        </Col>
        <Col sm={1} className="p-0">
          <Button
            variant="outline-secondary"
            onClick={() =>
              this.setState({ toggleToEditMode: false, hoveredInput: null })
            }
          >
            Cancel
          </Button>
        </Col>
      </Row>
    );
  }

  getEditInputButtons(input) {
    return this.canUserEditInput(input) ? (
      <div>
        <FontAwesomeIcon
          icon={faEdit}
          className="mx-1"
          style={{ cursor: "pointer" }}
          color="#6c757d"
          onClick={() =>
            this.setState({
              hoveredInput: { ...input },
              toggleToEditMode: true
            })
          }
        />
        <FontAwesomeIcon
          icon={faTrashAlt}
          className="mx-1"
          style={{ cursor: "pointer" }}
          color="#6c757d"
          onClick={() =>
            this.setState({ hoveredInput: { ...input }, showDeleteModal: true })
          }
        />
      </div>
    ) : (
      ""
    );
  }

  getInputsList() {
    const inputItems =
      this.props.inputs && this.props.inputs.length > 0 ? (
        this.props.inputs.map((input) => (
          <ListGroup.Item className="m-0 listItem" key={input.id}>
            {this.state.toggleToEditMode &&
            this.state.hoveredInput &&
            this.state.hoveredInput.id === input.id
              ? this.getEditableInput(input)
              : this.getReadOnlyInput(input)}
          </ListGroup.Item>
        ))
      ) : (
        <h3>No responses yet!</h3>
      );

    return (
      <Card>
        <Card.Header>
          <Row className="px-3 d-flex justify-content-between align-items-center">
            <Col sm={10}>
              <h6 className="my-0">Inputs</h6>
            </Col>
            <Col sm={2} className="d-flex justify-content-end">
              <Badge pill variant="info">
                {this.props.inputs.length}
              </Badge>

              <OverlayTrigger
                key="right"
                placement="right"
                trigger="hover"
                overlay={
                  <Tooltip id="approveHelp">
                    Default sort order for inputs is newest to oldest.
                  </Tooltip>
                }
              >
                <FontAwesomeIcon
                  className="ml-2"
                  icon={faSortAmountDown}
                  color="blue"
                />
              </OverlayTrigger>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          <ListGroup variant="flush" key="inputs">
            {inputItems}
          </ListGroup>
        </Card.Body>
      </Card>
    );
  }

  render() {
    return (
      <Container style={{ paddingTop: "3rem", paddingBottom: "3rem" }}>
        <Row>
          <Col className="p-0">{this.getPostInputForm()}</Col>
        </Row>
        <Row className="mt-3">
          <Col className="px-0 py-3">{this.getInputsList()}</Col>
        </Row>
      </Container>
    );
  }
}

export default InputsSection;
