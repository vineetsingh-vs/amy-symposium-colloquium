import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import AppHeader from "./components/AppHeader";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import {
  authenticatedGetJson,
  onUnauthedDefault,
  UNAUTHORIZED_STATUS
} from "./request";
import PaperDashboard from "./views/PaperDashboard";
import PaperEditPage from "./views/PaperEditPage";
import TransientCASLoginRedirect from "./views/TransientCASLoginRedirect";
import ReviewPaper from "./views/ReviewPaper";
import ReviewList from "./views/ReviewList";
import UserProfile from "./views/UserProfile";
import ActivityPage from "./views/ActivityPage";

export const PATHS = {
  HOME: "/",
  DASHBOARD: "/paperdashboard",
  PUBLISH_PAPER: "/publishpaper",
  EDIT_PAPER: "/editpaper",
  LIVE_MEETING: "/event",
  SIGNUP: "/sign-up",
  SIGNIN: "/sign-in",
  ACTIVITIY: "/activites",
};

export const URI_GENERATORS = {
  REVIEW_PAPER: paperId => "/reviewpaper/" + paperId,
  REVIEW_LIST: paperId => "/reviews/" + paperId,
  USER_PROFILE: userId => "/user/" + userId
}

class AppRouter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {}
    };

    this.fetchAndSetCurrentUser = this.fetchAndSetCurrentUser.bind(this);
  }

  fetchAndSetCurrentUser() {
    return authenticatedGetJson("/v1/users/me", response => response).then(
      response => {
        if (response.status !== UNAUTHORIZED_STATUS) {
          this.setState({ loggedInUser: response });
        } else {
          onUnauthedDefault(response);
        }
      }
    );
  }

  componentDidMount() {
    this.fetchAndSetCurrentUser();
  }

  render() {
    const NavRoute = ({ exact, path, component: Component }) => (
      <Route
        exact={exact}
        path={path}
        render={props => (
          <div>
            <AppHeader loggedInUser={this.state.loggedInUser} />
            <Component {...props} />
          </div>
        )}
      />
    );

    return (
      <Router>
        <div>
          {/* Our new beautiful login page is still under construction, so hidden for now */}
          <Route
            path={PATHS.HOME}
            exact
            render={props => (
              <Home {...props} fetchAndSetCurrentUser={this.fetchAndSetCurrentUser} loggedInUser={this.state.loggedInUser} />
            )}
          />
          <Route
            path={PATHS.SIGNIN}
            exact
            render={props => (
              <Login
                {...props}
                fetchAndSetCurrentUser={this.fetchAndSetCurrentUser}
                loggedInUser={this.state.loggedInUser}
              />
            )}
          />
          <Route path={PATHS.SIGNUP} exact component={Register} />

          <Route
            path="/cas_auth/:ticket"
            render={props => (
              <TransientCASLoginRedirect
                {...props}
                fetchAndSetCurrentUser={this.fetchAndSetCurrentUser}
              />
            )}
          />
          {!this.state.loggedInUser.name ? null : (
            <div>
              <NavRoute
                path={"/user/:userId"}
                exact
                component={() => (
                  <UserProfile loggedInUser={this.state.loggedInUser} />
                )}
              />
              <NavRoute
                path={PATHS.DASHBOARD}
                exact
                component={() => (
                  <PaperDashboard loggedInUser={this.state.loggedInUser} />
                )}
              />
              <NavRoute
                path={PATHS.PUBLISH_PAPER}
                key="addPaper"
                exact
                component={() => <PaperEditPage isNewPaper={true} loggedInUser={this.state.loggedInUser}/>}
              />
              <NavRoute
                path={PATHS.EDIT_PAPER}
                key="editPaper"
                exact
                component={() => <PaperEditPage isNewPaper={false} loggedInUser={this.state.loggedInUser}/>}
              />
              <NavRoute
                path={"/reviewpaper/:paperId"}
                key="reviewpaper"
                exact
                component={() => <ReviewPaper />}
              />
              <NavRoute
                path={"/reviews/:paperId"}
                key="reviews"
                exact
                component={() => <ReviewList />}
              />
              <NavRoute
                path={PATHS.ACTIVITIY}
                key="activity"
                exact
                component={() => <ActivityPage />}
              />
            </div>
          )}
        </div>
      </Router>
    );
  }
}

export default AppRouter;
