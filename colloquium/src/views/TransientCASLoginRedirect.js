import React from "react";
import { authenticate_cas } from "../request";
import { PATHS } from "../AppRouter";

class TransientCASLoginRedirect extends React.Component {
  componentDidMount() {
    const ticket = this.props.match.params.ticket;
    authenticate_cas(ticket).then(() => {
      this.props.fetchAndSetCurrentUser().then(() => {
        this.props.history.push(PATHS.DASHBOARD);
      });
    });
  }

  render() {
    return null;
  }
}

export default TransientCASLoginRedirect;
