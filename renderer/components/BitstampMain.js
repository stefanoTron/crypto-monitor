import { ipcRenderer, ipcMain } from "electron";
import React, { Component } from "react";

import GenericMain from "../components/GenericMain";
const WebSocket = require("ws");
let websocket = new WebSocket("wss://ws.bitstamp.net");

class BitstampMain extends Component {
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
    console.log("cdm");
    this.initWebsocket();
    //this.props.checkIfOnline();
  }

  initWebsocket() {
    websocket.on("error", e => {
      //ws.isAlive = true;
      console.log("error", e);
    });

    websocket.on("close", () => {
      console.log("closed");
      websocket = new WebSocket("wss://ws.bitstamp.net");
      this.initWebsocket();
      //this.unsubscribeChannels();
    });

    websocket.on("open", () => {
      console.log("opened");
      websocket.send(
        JSON.stringify({
          event: "bts:subscribe",
          data: {
            channel: "live_trades_btceur"
          }
        })
      );
      websocket.send(
        JSON.stringify({
          event: "bts:subscribe",
          data: {
            channel: "live_trades"
          }
        })
      );
      websocket.send(
        JSON.stringify({
          event: "bts:subscribe",
          data: {
            channel: "live_trades_ltceur"
          }
        })
      );
      websocket.send(
        JSON.stringify({
          event: "bts:subscribe",
          data: {
            channel: "live_trades_ltusd"
          }
        })
      );
      websocket.send(
        JSON.stringify({
          event: "bts:subscribe",
          data: {
            channel: "live_trades_ethusd"
          }
        })
      );
      websocket.send(
        JSON.stringify({
          event: "bts:subscribe",
          data: {
            channel: "live_trades_etheur"
          }
        })
      );
    });

    websocket.on("message", data => {
      const lastdata = JSON.parse(data);
      if (lastdata.data && !isNaN(lastdata.data.price)) {
        this.handleUpdate(lastdata.data, this.detectCoin(lastdata.channel));
      }
    });
  }

  detectCoin(channel) {
    if (channel === "live_trades") return "btcusd";
    let coin = channel.replace("live_trades_", "");
    return coin;
  }

  unsubscribeChannels() {
    websocket.send(
      JSON.stringify({
        event: "bts:unsubscribe",
        data: {
          channel: "live_trades_btceur"
        }
      })
    );
    websocket.send(
      JSON.stringify({
        event: "bts:unsubscribe",
        data: {
          channel: "live_trades"
        }
      })
    );
    websocket.send(
      JSON.stringify({
        event: "bts:unsubscribe",
        data: {
          channel: "live_trades_ltceur"
        }
      })
    );
    websocket.send(
      JSON.stringify({
        event: "bts:unsubscribe",
        data: {
          channel: "live_trades_ltcusd"
        }
      })
    );
    websocket.send(
      JSON.stringify({
        event: "bts:unsubscribe",
        data: {
          channel: "live_trades_ethusd"
        }
      })
    );
    websocket.send(
      JSON.stringify({
        event: "bts:unsubscribe",
        data: {
          channel: "live_trades_etheur"
        }
      })
    );
  }

  componentWillUnmount() {
    console.log("cwum");
    websocket.close();
  }

  handleUpdate = (data, coin) => {
    this.setState({
      [coin]: data.price_str
    });
    if (coin === this.props.store.get("defaultCoin")) {
      ipcRenderer.send("price-updated", { price: data.price_str, coin });
    }
  };

  render() {
    return (
      <div
        className={
          this.props.hide
            ? "hide window-content slide-left"
            : "window-content slide-left"
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

export default BitstampMain;
