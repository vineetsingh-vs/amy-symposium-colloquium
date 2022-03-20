import React from "react";
import { Container, Table } from "react-bootstrap";

class ParticipantsTable extends React.Component {
  getParticipantRows() {
    if (this.props.participants) {
      return this.props.participants.map((user, index) => (
        <tr key={user.id}>
          {/* <td>{index + 1}</td> */}
          <td>{user.name}</td>
        </tr>
      ));
    }
  }

  render() {
    return (
      <Container className="px-0">
        <Table responsive="sm" hover>
          <thead>
            <tr>
              {/* <th>#</th> */}
              {/* <th>Name</th> */}
            </tr>
          </thead>
          <tbody>{this.getParticipantRows()}</tbody>
        </Table>
      </Container>
    );
  }
}

export default ParticipantsTable;
