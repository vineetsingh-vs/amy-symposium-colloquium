import React from "react";
import "./Login.css";
import { authenticatedPostJson } from "./request";
import { Row, Button, Col } from "react-bootstrap";
import GoogleLogin from 'react-google-login';
import FacebookLogin  from 'react-facebook-login';
import {Google_API, Fb_Id} from "./request";
import CollLogo from "./assets/FullTransparent.png"

class Register extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      email: ""
    };

    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  handleSubmit(event) {
    event.preventDefault();
    var data = JSON.stringify({
      Method: "Normal",
      name: this.state.username,
      password: this.state.password,
      email: this.state.email,
    })
    authenticatedPostJson("/register", data).then((response) =>
      this.props.history.push("/")
    );
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    });
  }

  handleUsernameChange(event) {
    this.setState({
      username: event.target.value
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    });
  }

  render() {
    return (
      <div className="fullscreen m-0">
        <Row>
          <Col sm={12} className="collLogo">
          <img className="collLogo"
              alt="Colloquium Logo"
              src={CollLogo}
            ></img>
          </Col>
        </Row>
        <Row>
          <hr></hr>
        </Row>
        <Row className="center">
          <Col sm={6} className="signInContainer">
            <form onSubmit={this.handleSubmit} className="container">
              <Row className="m-3">
                <label htmlFor="usernameid">Username</label>
                <input
                  required
                  className="form-control"
                  type="text"
                  name="username"
                  id="usernameid"
                  value={this.state.token}
                  onChange={this.handleUsernameChange}
                />
              </Row>
              <Row className="m-3">
                <label htmlFor="emailid">Email</label>
                <input
                  required
                  className="form-control"
                  type="text"
                  name="email"
                  id="emailid"
                  value={this.state.token}
                  onChange={this.handleEmailChange}
                />
              </Row>
              <Row className="m-3">
                <label htmlFor="passwordid">Password</label>
                <input
                  required
                  className="form-control"
                  type="password"
                  name="password"
                  id="passwordid"
                  value={this.state.token}
                  onChange={this.handlePasswordChange}
                />
              </Row>
              <Row>
                <Button
                  className="m-4 btn-success btn-block"
                  type="submit"
                  value="Submit"
                >
                  Sign Up
                </Button>
              </Row>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}


export default Register;
