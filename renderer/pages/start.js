import electron, { ipcRenderer } from "electron";
import React, { Component } from "react";
import Header from "../components/Header";
import Options from "../components/Options";
import BitstampMain from "../components/BitstampMain";
import CoinbaseMain from "../components/CoinbaseMain";
import BitfinexMain from "../components/BitfinexMain";
import { I18nextProvider } from "react-i18next";
import startI18n from "../tools/startI18n";
import Head from "next/head";

const Store = require("electron-store");
import globalStyle from "../css/styles.js";

class MainApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onLine: true,
      showOptions: false
    };
    this.i18n = {};
    this.store = {};

    this.store.get = function() {};
    const remote = electron.remote || false;
    if (remote) {
      this.store = new Store({
        defaults: {
          defaultCoin: "btceur",
          source: "bitstamp",
          lang: "en",
          start: true
        }
      });
    }
    this.i18n = startI18n(this.store.get("lang"));
  }

  componentDidMount() {
    this.checkIfOnline();
  }

  componentWillUnmount() {
    window.removeEventListener("offline");
    window.removeEventListener("online");
  }

  quitApp = () => {
    ipcRenderer.send("quit");
  };

  checkIfOnline = () => {
    this.setState({
      onLine: navigator.onLine
    });

    window.addEventListener("offline", () => {
      this.setState({
        onLine: navigator.onLine
      });
    });
    window.addEventListener("online", () => {
      this.setState({
        onLine: navigator.onLine
      });
    });
  };

  toggleOptions = () => {
    this.setState({
      showOptions: !this.state.showOptions
    });
  };

  render() {
    return (
      <I18nextProvider i18n={this.i18n}>
        <div>
          <Head>
            <title>Crypto Monitor</title>
          </Head>
          <div className="header-arrow" />
          <div className="window">
            <Header
              quitApp={this.quitApp}
              onLine={this.state.onLine}
              toggleOptions={this.toggleOptions}
              isOptionsActive={this.state.showOptions}
            />

            <Options
              store={this.store}
              quitApp={this.quitApp}
              hide={!this.state.showOptions}
              onLine={this.state.onLine}
            />
            {this.store.get("source") === "bitstamp" ? (
              <BitstampMain
                store={this.store}
                hide={this.state.showOptions}
                checkIfOnline={this.checkIfOnline}
              />
            ) : null}
            {this.store.get("source") === "coinbase" ? (
              <CoinbaseMain
                store={this.store}
                hide={this.state.showOptions}
                checkIfOnline={this.checkIfOnline}
              />
            ) : null}

            {this.store.get("source") === "bitfinex" ? (
              <BitfinexMain
                store={this.store}
                hide={this.state.showOptions}
                checkIfOnline={this.checkIfOnline}
              />
            ) : null}
          </div>
          <style jsx global>
            {globalStyle}
          </style>
        </div>
      </I18nextProvider>
    );
  }
}

export default MainApp;
