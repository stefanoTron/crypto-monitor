import { ipcRenderer, ipcMain } from "electron";
import PusherJS from "pusher-js";
import React, { Component } from "react";
import Header from "../components/Header";
import Options from "../components/Options";
import GenericMain from "../components/GenericMain";
import globalStyle from "../css/styles.js";
import Gdax from "gdax";

class CoinbaseMain extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btceur: 0,
      btcusd: 0,
      ltceur: 0,
      ltcusd: 0,
      etheur: 0,
      ethusd: 0
    };
  }

  componentDidMount() {
    this.props.checkIfOnline();
    this.websocket = new Gdax.WebsocketClient(
      ["BTC-USD", "ETH-USD", "BTC-EUR", "ETH-EUR", "LTC-EUR", "LTC-USD"],
      undefined,
      undefined,
      {
        channels: ["ticker"]
      }
    );
    this.websocket.on("message", data => {
      //updated values on ticker event
      if (data.type === "ticker") {
        this.handleUpdate(
          data.price,
          data.product_id.toLowerCase().replace(/[_-]/g, "") //format BTC-EUR to btceur
        );
      }
    });
  }

  componentWillUnmount() {
    this.websocket.unsubscribe({ channels: ["heartbeat", "ticker"] });
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

export default CoinbaseMain;
