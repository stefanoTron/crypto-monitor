import React, { Component } from "react";
import { translate } from "react-i18next";

import Settings3 from "@haiku/littletower-settings3/react";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDropdown: false
    };
  }

  toggleDropdown = () => {
    this.setState({
      showDropdown: !this.state.showDropdown
    });
  };

  closeDropdown = () => {
    this.setState({
      showDropdown: false
    });
  };

  render() {
    return (
      <header className="toolbar toolbar-header">
        <div className="icon-item" />
        <div className="icon-item" />

        <h1
          className={!this.props.isOptionsActive ? "title" : "title cursor"}
          onClick={
            !this.props.isOptionsActive ? null : this.props.toggleOptions
          }
        >
          Crypto Monitor
        </h1>

        <div className="icon-item">
          {/*<button
            className="btn btn-default btn-dropdown pull-right"
            onClick={this.toggleDropdown}
          >
            <span className="icon icon-cog footer-icon" />
            <ul
              className={
                "dropdown " + (this.state.showDropdown ? "active" : "")
              }
            >
              <li>
                <a
                  className={
                    "nav-group-item " +
                    (this.props.isOptionsActive ? "active" : "")
                  }
                  onClick={
                    this.props.isOptionsActive ? null : this.props.toggleOptions
                  }
                  href="#"
                >
                  {this.props.t("options")}
                </a>
              </li>
              <li>
                <a
                  className="nav-group-item"
                  onClick={this.props.quitApp}
                  href="#"
                >
                  {this.props.t("quit")}
                </a>
              </li>
            </ul>
          </button>*/}
        </div>
        <div className="icon-item cursor">
          <Settings3
            id="settings"
            onClick={this.props.toggleOptions}
            contextMenu="disabled"
            sizing="contain"
            states={{
              circleColor: { value: "#fff" },
              lineColor: {
                value: this.props.isOptionsActive ? "#999" : "#222"
              },
              lineWidth: { value: "20" }
            }}
            loop={true}
          />
        </div>
      </header>
    );
  }
}

export default translate(["translations"])(Header);
