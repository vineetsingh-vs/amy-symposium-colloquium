import React from "react";
import "./Login.css";
import { authenticate } from "./request";
import { Row, Button, Col } from "react-bootstrap";
import { PATHS } from "./AppRouter";
import CollLogo from "./assets/FullTransparent.png"

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    authenticate(this.state.email, this.state.password).then(() => {
      this.props.fetchAndSetCurrentUser();
      this.props.history.push(PATHS.DASHBOARD);
    });
  }

  handleEmailChange(event) {
    this.setState({
      email: event.target.value
    });
  }

  handlePasswordChange(event) {
    this.setState({
      password: event.target.value
    });
  }

  render() {
    if (this.props.loggedInUser.name) {
      this.props.history.push(PATHS.DASHBOARD);
      return null;
    }

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
                <label htmlFor="usernameid">Email</label>
                <input
                  required
                  className="form-control"
                  type="text"
                  name="username"
                  id="usernameid"
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
                  Sign In
                </Button>
              </Row>
            </form>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Login;
