import React from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Col, Container, Row } from "react-bootstrap";
import "../css/DragDropList.css";

class DragDropList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.onDragEnd = this.onDragEnd.bind(this);
  }

  reorder(list, startIndex, endIndex) {
    const result = list;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    this.reorder(
      this.props.items,
      result.source.index,
      result.destination.index
    );

    this.props.update(this.props.items);
  }

  render() {
    const getListStyle = (isDraggingOver) => ({
      background: isDraggingOver ? "#cee3f9" : "white"
    });

    const getItemStyle = (isDragging, draggableStyle) => ({
      userSelect: "none",
      background: isDragging ? "#6c757d" : "#f8f9fa",
      color: isDragging ? "white" : "black",
      borderColor: isDragging ? "black" : "#e6e9ed",
      boxShadow: !this.props.disabled && isDragging ? "0 2px 10px #a6a9ac" : "",
      // styles we need to apply on draggables
      ...draggableStyle
    });

    return (
      <Container>
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId="options">
            {(provided, snapshot) => (
              <Row
                className="justify-content-center"
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                <Col sm={8}>
                  {this.props.items.map((option, index) => (
                    // has to be string id
                    <Draggable
                      key={index}
                      draggableId={"item_" + index}
                      index={index}
                      isDragDisabled={this.props.disabled}
                    >
                      {(provided, snapshot) => {
                        return (
                          <Row
                            className={
                              "m-3 p-2 align-items-center border" +
                              (this.props.disabled ? "" : " dragItem")
                            }
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <Col sm={1} className="px-0">
                              <span className="step">{index + 1}</span>
                            </Col>
                            <Col className="align-items-center">
                              <p className="mb-0 lead">{option.option_name}</p>
                            </Col>
                          </Row>
                        );
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Col>
              </Row>
            )}
          </Droppable>
        </DragDropContext>
      </Container>
    );
  }
}

export default DragDropList;
