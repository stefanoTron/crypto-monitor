import { ipcRenderer, ipcMain } from "electron";
import PusherJS from "pusher-js";
import React, { Component } from "react";
import Header from "../components/Header";
import Options from "../components/Options";
import GenericMain from "../components/GenericMain";
import globalStyle from "../css/styles.js";
import BFX from "bitfinex-api-node";

class BitfinexMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btceur: 0,
      btcusd: 0,
      ltceur: "-,-- €", //LTCEUR is not supported on Bitfinex
      ltcusd: 0,
      etheur: 0,
      ethusd: 0
    };
  }
  componentDidMount() {
    this.props.checkIfOnline();

    const BFX = require("bitfinex-api-node");
    this.bfx = new BFX({
      transform: true
      /*   ws: {
       autoReconnect: true,
       seqAudit: true,
       packetWDDelay: 10 * 1000
     }*/
    });

    this.ws = this.bfx.ws();
    this.ws.on("open", () => {
      //subscribe to Bitfinex's tickers
      this.ws.subscribeTicker("tBTCUSD");
      this.ws.subscribeTicker("tBTCEUR");
      this.ws.subscribeTicker("tETHUSD");
      this.ws.subscribeTicker("tETHEUR");
      this.ws.subscribeTicker("tLTCUSD");
      //LTCEUR is not supported on Bitfinex
      //this.ws.subscribeTicker("tLTCEUR");
    });
    this.ws.on("error", e => {
      console.error("Bitfinex error:", e);
    });

    this.ws.onTicker({ symbol: "tETHUSD" }, ticker => {
      let price = ticker.toJS().lastPrice;
      this.handleUpdate(price, "ethusd");
    });
    this.ws.onTicker({ symbol: "tETHEUR" }, ticker => {
      let price = ticker.toJS().lastPrice;
      this.handleUpdate(price, "etheur");
    });
    this.ws.onTicker({ symbol: "tBTCUSD" }, ticker => {
      let price = ticker.toJS().lastPrice;
      this.handleUpdate(price, "btcusd");
    });
    this.ws.onTicker({ symbol: "tBTCEUR" }, ticker => {
      let price = ticker.toJS().lastPrice;
      this.handleUpdate(price, "btceur");
    });
    this.ws.onTicker({ symbol: "tLTCUSD" }, ticker => {
      let price = ticker.toJS().lastPrice;
      this.handleUpdate(price, "ltcusd");
    });

    this.handleUpdate(this.state.ltceur, "ltceur");

    this.ws.open();
  }

  componentWillUnmount() {
    this.ws.unsubscribeTicker("tBTCUSD");
    this.ws.unsubscribeTicker("tBTCEUR");
    this.ws.unsubscribeTicker("tETHUSD");
    this.ws.unsubscribeTicker("tETHEUR");
    this.ws.unsubscribeTicker("tLTCUSD");
  }

  handleUpdate = (price, coin) => {
    this.setState({
      [coin]: price
    });
    if (coin === this.props.store.get("defaultCoin")) {
      ipcRenderer.send("price-updated", { price, coin });
    }
  };

  render() {
    return (
      <div
        className={
          this.props.hide ? (
            "hide window-content slide-left"
          ) : (
            "window-content slide-left"
          )
        }
      >
        <div className="pane-group">
          <div className="pane">
            <GenericMain {...this.state} />
          </div>
        </div>
      </div>
    );
  }
}

export default BitfinexMain;
