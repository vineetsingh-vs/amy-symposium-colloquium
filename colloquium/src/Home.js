import React from "react";
import { Button, Container, Row } from "react-bootstrap";
import CASLogo from "./assets/umd-logo-small.png";
import UMDLogo from "./assets/umd-logo.png";
import CollLogo from "./assets/FullTransparent.png"
import "./css/Home.css";
import { PATHS } from "./AppRouter";
import GoogleLogin from "react-google-login";
import FacebookLogin from 'react-facebook-login/dist/facebook-login-render-props'
import { Google_API, Fb_Id } from "./request";
import { authenticate_social, authenticatedPostJson } from "./request";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.responseGoogle = this.responseGoogle.bind(this);
    this.responseFacebook = this.responseFacebook.bind(this);
  }

  responseGoogle(googleUser) {
    const data = JSON.stringify({
      Method:"Google",
      name:googleUser.profileObj.name,
      email:googleUser.profileObj.email,
      id:googleUser.profileObj.googleId
    })
    authenticatedPostJson("/register", data).then((responseOther) => {
      authenticate_social("Google", googleUser.profileObj.email, googleUser.tokenId).then(
        () => {
          this.props.fetchAndSetCurrentUser();
          this.props.history.push(PATHS.DASHBOARD);
        }
      );
    });
  }  

  responseFacebook(Fresponse) {
    const data = JSON.stringify({
      Method:"Facebook",
      name:Fresponse.name,
      email:Fresponse.email,
      id:Fresponse.id
    })
    authenticatedPostJson("/register", data).then((responseOther) => {
      authenticate_social("Facebook", Fresponse.email, Fresponse.accessToken).then(
        () => {
          this.props.fetchAndSetCurrentUser();
          this.props.history.push(PATHS.DASHBOARD);
        }
      );
    });
  }

  render() {
    if (this.props.loggedInUser.name) {
      this.props.history.push(PATHS.DASHBOARD);
      return null;
    }

    return (
      <Container className="m-0 p-0" fluid>
        <Container fluid className="hero-image hero-container">
          <Row className="justify-content-end p-4">
            <img
              className="umd-logo"
              alt="University of Maryland Logo"
              src={UMDLogo}
            ></img>
          </Row>
          <Row>
          <img
              alt="Colloquium Logo"
              src={CollLogo}
            ></img>
          </Row>
          <Row>
            <Button
              className="signin-button"

              href={
                "https://shib.idm.umd.edu/shibboleth-idp/profile/cas/login?service=" +
                encodeURIComponent(window.location.origin + "/") +
                "register"
              }
            >
              <img
                style={{ width: "24px", height: "24px" }}
                src={CASLogo}
                alt="CAS sign in logo"
              />
              &nbsp;&nbsp;Sign In With CAS
            </Button>
          </Row>
          <Row style={{ paddingTop: "2rem" }}>
            <GoogleLogin
              clientId={Google_API}
              render={(renderProps) => (
                <Button
                  onClick={renderProps.onClick}
                  disabled={renderProps.disabled}
                  className="signin-button"
                >
                  Sign In With Google
                </Button>
              )}
              onSuccess={this.responseGoogle}
            />
          </Row>
          <Row style={{ paddingTop: "2rem" }}>
            <FacebookLogin
              appId={Fb_Id}
              callback={this.responseFacebook}
              fields='name,email'
              render={renderProps => (
                <Button
                  onClick={renderProps.onClick}
                  className="signin-button"
                >
                  Sign In With Facebook
                </Button>
              )}
            />
          </Row>
          <Row style={{ paddingTop: "2rem" }}>
            <Button
              className="signin-button"
              href={PATHS.SIGNIN}
            >
              Sign In With Email
            </Button>
          </Row>
          <Row style={{ paddingTop: "2rem" }}>
            <Button
              className="signin-button"
              href={PATHS.SIGNUP}
            >
              Sign Up with Email
            </Button>
          </Row>
          <Row>
            <footer className="footer">
              <small className="d-block">
                Copyright (c) 2021&nbsp;{" "}
                <a style={{ color: "#23449B" }} href="https://seam.cs.umd.edu/">
                  Seam Lab
                </a>
              </small>
            </footer>
          </Row>
        </Container>
      </Container>
    );
  }
}

export default Home;
