import React from "react";
import { Container, Table } from "react-bootstrap";

class EventParticipantsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  getParticipantRows() {
    return this.props.event.participants.map((user, index) => (
      <tr key={user.id}>
        <td>{index + 1}</td>
        <td>{user.name}</td>
      </tr>
    ));
  }

  render() {
    return (
      <Container style={{ marginTop: "3rem" }}>
        <Table responsive="sm" hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
            </tr>
          </thead>
          <tbody>{this.getParticipantRows()}</tbody>
        </Table>
      </Container>
    );
  }
}

export default EventParticipantsTab;
