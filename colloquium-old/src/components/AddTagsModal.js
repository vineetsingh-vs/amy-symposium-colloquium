import React from "react";
import { Button, Modal, Form, Col, Table, Badge } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserFriends } from "@fortawesome/free-solid-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default class AddTagsModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tags: this.props.tags,
      newTag: "",
    };

    this.handleSave = this.handleSave.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleSave() {
    this.props.handleSave([...this.state.tags]);
    this.setState({ tags: []});
    this.props.handleClose();
  }

  handleClose() {
    this.setState({ tags: [] });
    this.props.handleClose();
  }

  removeTag(index) {
    this.updateTags(
      this.state.tags.filter((_, i) => index !== i)
    );
  }

  updateTags(updatedTags){
    this.setState({
      tags: [...updatedTags]
    });
  }


  getTitle() {
    return this.props.selectedTags.length
      ? "Modify Tags"
      : "Add Tags";
  }

  render() {
    return (
      <Modal
      onShow={
          () => {
          this.setState({
            tags: 
            this.props.tags
          });
        }          
      }
      show={this.props.show}
      onHide={this.handleClose}
      >
        <Modal.Header closeButton>
          <Modal.Title>
            <FontAwesomeIcon className="pr-2" icon={faUserFriends} />
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Row>
              <Form.Group as={Col}>
                <Table responsive="sm" hover>
                  <thead>
                    <tr>
                      <th>Tags</th>
                    </tr>
                  </thead>
                </Table>
              {this.state.tags.map((tag, index) => (
                <Badge 
                  style={{ marginRight: "4px" }}
                  key={index}
                  variant="secondary"
                >
                  {tag + " "}
                  <FontAwesomeIcon
                    icon={faTimes}
                    onClick={() => this.removeTag(index)}
                  />
                </Badge>
              ))              
              }
              <div style={{margin: "20px"}}></div>        
                <Form.Control
                  onChange={(e) =>
                    this.setState({ newTag: e.target.value })
                  }
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      if(!this.state.tags.includes(this.state.newTag)){
                        e.preventDefault();
                        this.setState({
                          tags: 
                          [
                            ...this.state.tags,
                            this.state.newTag
                          ]
                          ,
                          newTag: ""
                        });
                        console.log(this.state.tags);

                      }
                    else{
                      e.preventDefault();
                        this.setState({
                          tags: 
                          [
                            ...this.state.tags 
                          ]
                          ,
                          newTag: ""
                        });

                    }
                  }
                  }}
                  placeholder="Enter tag"
                  value={this.state.newTag}
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
