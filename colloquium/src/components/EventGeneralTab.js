import React from "react";
import { Col, Row, Form } from "react-bootstrap";

class EventGeneralTab extends React.Component {
  render() {
    return (
      <Form style={{ marginTop: "3rem" }}>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Name
          </Form.Label>
          <Col sm="10">
            <Form.Control
              plaintext
              readOnly
              defaultValue={this.props.event.name}
            />
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm="2">
            Hosted By
          </Form.Label>
          <Col sm="10">
            <Form.Control
              plaintext
              readOnly
              defaultValue={this.props.event.creator.name}
            />
          </Col>
        </Form.Group>
      </Form>
    );
  }
}

export default EventGeneralTab;
