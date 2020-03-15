import { ipcRenderer, ipcMain } from "electron";
import React, { Component } from "react";

import GenericMain from "../components/GenericMain";
const WebSocket = require("ws");

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

  ws = new WebSocket("wss://ws.bitstamp.net");

  componentDidMount() {
    this.props.checkIfOnline();

    this.ws.on("open", () => {
      this.ws.send(
        JSON.stringify({
          event: "bts:subscribe",
          data: {
            channel: "live_trades_btceur"
          }
        })
      );
      this.ws.send(
        JSON.stringify({
          event: "bts:subscribe",
          data: {
            channel: "live_trades"
          }
        })
      );
      this.ws.send(
        JSON.stringify({
          event: "bts:subscribe",
          data: {
            channel: "live_trades_ltceur"
          }
        })
      );
      this.ws.send(
        JSON.stringify({
          event: "bts:subscribe",
          data: {
            channel: "live_trades_ltusd"
          }
        })
      );
      this.ws.send(
        JSON.stringify({
          event: "bts:subscribe",
          data: {
            channel: "live_trades_ethusd"
          }
        })
      );
      this.ws.send(
        JSON.stringify({
          event: "bts:subscribe",
          data: {
            channel: "live_trades_etheur"
          }
        })
      );
    });

    this.ws.on("message", data => {
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

  componentWillUnmount() {
    this.channel.unbind();
    this.channelUsd.unbind();
    this.channelLtc.unbind();
    this.channelEth.unbind();
    this.channelLtcUsd.unbind();
    this.channelEthUsd.unbind();
    this.pusherClient.unsubscribe();
    this.pusherClient.disconnect();
    this.ws.send(
      JSON.stringify({
        event: "bts:unsubscribe",
        data: {
          channel: "live_trades_btceur"
        }
      })
    );
    this.ws.send(
      JSON.stringify({
        event: "bts:unsubscribe",
        data: {
          channel: "live_trades"
        }
      })
    );
    this.ws.send(
      JSON.stringify({
        event: "bts:unsubscribe",
        data: {
          channel: "live_trades_ltceur"
        }
      })
    );
    this.ws.send(
      JSON.stringify({
        event: "bts:unsubscribe",
        data: {
          channel: "live_trades_ltcusd"
        }
      })
    );
    this.ws.send(
      JSON.stringify({
        event: "bts:unsubscribe",
        data: {
          channel: "live_trades_ethusd"
        }
      })
    );
    this.ws.send(
      JSON.stringify({
        event: "bts:unsubscribe",
        data: {
          channel: "live_trades_etheur"
        }
      })
    );

    this.ws.terminate();
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
