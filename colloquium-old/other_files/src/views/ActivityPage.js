import React from "react";
import { withRouter } from "react-router-dom";
import { authenticatedGetJson } from "../request";
import { Container, Row, Table, Button } from "react-bootstrap";
class ActivityPage extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      activities: [],
    };

    this.generateTableHead = this.generateTableHead.bind(this)
  }

  componentDidMount(){
    authenticatedGetJson("/v1/activities").then((response)=>{
      response.map((item,_) =>{
          item.user = item.user.id
      })
      console.log(response)
      this.setState({
        activities: response,
      });
      this.renderTableu(response)
    });
    //define data array
    
  }
  generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
      let th = document.createElement("th");
      let text = document.createTextNode(key);
      th.appendChild(text);
      row.appendChild(th);
    }
  }
  generateTable(table, data) {
    for (let element of data) {
      let row = table.insertRow();
      for (let key in element) {
        let cell = row.insertCell();
        let text = document.createTextNode(" -  " + element[key] + "  -  ");
        cell.appendChild(text);
      }
    }
  }
  renderTableu(activity){
    const columns = [
      "Time","Event_Name","User_Name","Activity_ID"
    ]
    let table = document.getElementById("note");
    this.generateTableHead(table, columns);
    this.generateTable(table,activity)
  }

  render() {
    const columns = [
        {title:"Activity_ID",field:"id"},
        {title:"Time",field:"datetime"},
        {title:"Event_Name",field:"event"},
        {title:"User_Name",field:"user"}
    ]

    return (
      <Container className="m-5">
        <Row className="border-bottom" style={{ marginBottom: "3rem" }}>
          <h3>Activities</h3>
        </Row>
        <div>
        <table id="note"></table>
        </div>
        
        <Row>
        
          {/* <Table hover>
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
          </Table> */}
        </Row>
      </Container>
    );
  }
}

export default withRouter(ActivityPage);
