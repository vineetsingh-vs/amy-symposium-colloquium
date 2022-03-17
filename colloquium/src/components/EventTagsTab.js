import React from "react";
import { Container, Table } from "react-bootstrap";

class EventTagsTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null
    };
  }

  getTagsRows() {
    if(this.props.event && this.props.event.tags){
          return this.props.event.tags.map((t,i) => (
            <tr key={i}>
              <td>{t}</td>
            </tr>
          ));
        }
        else{
          return (
          <tr >
            <td>no tags</td>
          </tr>);
        }
      }

  
  

  render() {
    return (
      <Container style={{ marginTop: "3rem" }}>
      <Table responsive="sm" hover>
        <tbody>
        {this.getTagsRows()}
        </tbody>
      </Table>
    </Container>
    );
  }
}

export default EventTagsTab;