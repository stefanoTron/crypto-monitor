import { ipcRenderer, ipcMain } from "electron";
import PusherJS from "pusher-js";
import React, { Component } from "react";
import Header from "../components/Header";
import Options from "../components/Options";
import globalStyle from "../css/styles.js";

class GenericMain extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ul className="list-group">
        <li className="list-group-item">
          <img
            className="img-circle media-object pull-left"
            src="/static/bitcoin.svg"
            width="32"
            height="32"
          />

          <div className="media-body" style={{ marginRight: "32px" }}>
            <strong>Bitcoin</strong>
            <p>
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR"
              }).format(this.props.btceur)}{" "}
              <span style={{ float: "right" }}>
                {new Intl.NumberFormat("en-Us", {
                  style: "currency",
                  currency: "USD"
                }).format(this.props.btcusd)}
              </span>
            </p>
          </div>
        </li>
        <li className="list-group-item">
          <img
            className="img-circle media-object pull-left"
            src="/static/litecoin.svg"
            width="32"
            height="32"
          />
          <div className="media-body" style={{ marginRight: "32px" }}>
            <strong>Litecoin</strong>
            <p>
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR"
              }).format(this.props.ltceur)}{" "}
              <span style={{ float: "right" }}>
                {new Intl.NumberFormat("en-Us", {
                  style: "currency",
                  currency: "USD"
                }).format(this.props.ltcusd)}
              </span>
            </p>
          </div>
        </li>
        <li className="list-group-item">
          <img
            className="img-circle media-object pull-left"
            src="/static/ethereum.svg"
            width="32"
            height="32"
          />
          <div className="media-body" style={{ marginRight: "32px" }}>
            <strong>Ethereum</strong>
            <p>
              {new Intl.NumberFormat("de-DE", {
                style: "currency",
                currency: "EUR"
              }).format(this.props.etheur)}{" "}
              <span style={{ float: "right" }}>
                {new Intl.NumberFormat("en-Us", {
                  style: "currency",
                  currency: "USD"
                }).format(this.props.ethusd)}
              </span>
            </p>
            <p> </p>
          </div>
        </li>
      </ul>
    );
  }
}

export default GenericMain;
