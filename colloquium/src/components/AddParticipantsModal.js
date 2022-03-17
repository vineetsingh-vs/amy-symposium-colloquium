import React from "react";
import { Button, Modal, Form, Col } from "react-bootstrap";
import UserPicker from "./UserPicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";

export default class AddParticipantsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      participants: []
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.updateParticipants = this.updateParticipants.bind(this);
  }

  handleSave() {
    this.props.handleSave([...this.state.participants]);
    this.setState({ participants: [] });
    this.props.handleClose();
  }

  handleClose() {
    this.setState({ participants: [] });
    this.props.handleClose();
  }

  updateParticipants(updatedParticipants) {
    this.setState({
      participants: [...updatedParticipants]
    });
  }

  getTitle() {
    return this.props.selectedParticipants.length
      ? "Modify Authors"
      : "Add Authors";
  }

  render() {
    return (
      <Modal
        onShow={() => {
          this.setState({
            participants: this.props.selectedParticipants
          });
        }}
        show={this.props.show}
        onHide={this.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon className="pr-2" icon={faUserFriends} />
            {this.getTitle()}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <UserPicker
                  selectedUsers={this.state.participants}
                  updateSelectedUsers={this.updateParticipants}
                  loggedInUser={this.props.loggedInUser}
                />
              </Form.Group>
            </Form.Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={this.handleSave}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}
