import React from "react";
import "../css/ToggleSwitch.css";

class ToggleSwitch extends React.Component {
  render() {
    return (
      <div className="toggle-switch pull-right">
        <input
          id={this.props.uniqueKey}
          name={this.props.uniqueKey}
          type="checkbox"
          checked={this.props.checked}
          onChange={this.props.onChange}
        />
        <label htmlFor={this.props.uniqueKey} className="label-default" />
      </div>
    );
  }
}

export default ToggleSwitch;
